# Java SE 8 Fundamentals and Programmer Concepts

## How to Use These Notes

These notes introduce the Java language from basic program structure
through object-oriented programming. The examples target **Java SE 8**
syntax unless a section explicitly says otherwise.

Some examples are fragments intended to illustrate one concept; they are
not all standalone files. When combining examples into a project,
remember that a public top-level class normally belongs in a file with
the same name, and package declarations must match the project
structure.

## 1. Java Program Structure

### 1.1 A minimal class

A Java program is built from classes. A class can contain fields,
constructors, and methods.

``` java
class Useless {
}
```

This is a valid class declaration, although it does not do anything by
itself.

### 1.2 The `main` method

For a conventional Java application, execution starts at the `main`
method:

``` java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

Understand the declaration piece by piece:

- `public` makes the method accessible to the Java launcher.
- `static` means the method belongs to the class rather than to an
  instance.
- `void` means the method does not return a value.
- `main` is the entry-point method name.
- `String[] args` receives command-line arguments as an array of
  strings.

Use `String`, not `Strings`, and `println`, not `prinln`. Java is
case-sensitive, so spelling and capitalization matter.

### 1.3 Typical class layout

``` java
package com.example.domain;

import java.time.LocalDate;

public class Example {
    // Fields describe the state of an object.
    private String name;
    private LocalDate createdOn;

    // Constructors initialize new objects.
    public Example(String name, LocalDate createdOn) {
        this.name = name;
        this.createdOn = createdOn;
    }

    // Methods define behavior.
    public String getName() {
        return name;
    }
}
```

A source file commonly contains, in this order:

1. An optional `package` declaration.
2. Zero or more `import` declarations.
3. A class or other type declaration.

Within a class, fields, constructors, and methods are common members.
This is a useful convention, not a requirement that every class contain
all three.

### 1.4 Naming conventions

Java naming conventions make code easier to scan:

- **Classes and interfaces:** `UpperCamelCase`, usually nouns or noun
  phrases, such as `CreditCard` and `Employee`.
- **Variables and methods:** `lowerCamelCase`, such as `accountName`
  and `calculateCharges()`.
- **Constants:** uppercase words separated by underscores, such as
  `MAX_RETRIES`. This convention is normally used for `static final`
  constants.
- **Packages:** lowercase names, commonly based on a reversed domain
  name, such as `com.example.domain`.

``` java
public class CreditCard {
    public static final int VISA_NETWORK_CODE = 5001;

    private String accountName;
    private String cardName;

    public double calculateCharges() {
        return 0.0;
    }

    public void displayCharges() {
        // Display charge information.
    }
}
```

`final` means a variable cannot be reassigned after initialization. It
does not, by itself, make every object reachable through that variable
immutable.

### 1.5 Code blocks

Braces `{}` delimit a block of code. A method body and the body of an
`if`, loop, or class are examples of blocks.

``` java
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}
```

The statements inside each block execute according to the control-flow
construct that owns it.

## 2. Primitive Types and Numeric Literals

### 2.1 The primitive data types

Java has eight primitive types:

Category Type Description
  ---------------- ----------- --------------------------------------
Integer          `byte`      8-bit signed integer
Integer          `short`     16-bit signed integer
Integer          `int`       32-bit signed integer
Integer          `long`      64-bit signed integer
Floating point   `float`     32-bit IEEE 754 floating-point value
Floating point   `double`    64-bit IEEE 754 floating-point value
Character        `char`      16-bit UTF-16 code unit
Boolean          `boolean`   `true` or `false`

Examples:

``` java
byte smallNumber = 100;
short year = 2026;
int population = 250_000;
long distance = 9_000_000_000L;

float ratio = 22.0F;
double measurement = 4.022E23;

char letter = 'a';
char newline = '\n';

boolean active = true;
boolean complete = false;
```

The `L` suffix marks a `long` literal. The `F` suffix marks a `float`
literal; without it, a decimal floating-point literal is normally a
`double`.

### 2.2 Numeric literal forms

Java supports decimal, hexadecimal, binary, and octal integer literals.
A hexadecimal literal uses `0x` or `0X`; a binary literal uses `0b` or
`0B`.

``` java
int decimal = 26;
int hexadecimal = 0x1A;
int binary = 0b0001_1010;
int octal = 032; // Octal 32 is decimal 26.
```

Underscores can separate digits to improve readability, but they cannot
be placed arbitrarily---for example, directly next to a decimal point or
at the beginning or end of a literal.

``` java
long cardNumber = 1234_5678_9012_3456L;
long hexWord = 0xCAFE_BABEL;
byte nybbles = 0b0010_0101;
```

Choose the type that can represent the values required by the
application. Do not use `float` or `double` for exact decimal currency
arithmetic without understanding their binary floating-point behavior.

## 3. Operators and Expressions

### 3.1 Assignment and arithmetic

Operator Meaning
  ---------- -------------------------------------
`=`        Assign a value
`+`        Addition; also string concatenation
`-`        Subtraction
`*`        Multiplication
`/`        Division
`%`        Remainder

For integer operands, division discards the fractional part:

``` java
int result = 7 / 2;       // 3
double precise = 7.0 / 2; // 3.5
int remainder = 7 % 2;    // 1
```

### 3.2 Unary and increment operators

- `+value` applies unary plus.
- `-value` negates a numeric value.
- `++value` increments before the expression's value is used.
- `value++` increments after the current expression value is used.
- `--value` and `value--` work similarly for decrement.
- `!condition` reverses a boolean value.

Prefer simple increment expressions over embedding `++` in complicated
expressions, where evaluation order can be hard to read.

### 3.3 Equality and relational operators

Operator Meaning
  ---------- --------------------------
`==`       Equal
`!=`       Not equal
`>`        Greater than
`>=`       Greater than or equal to
`<`        Less than
`<=`       Less than or equal to

For primitive values, `==` compares values. For object references, it
compares whether the references point to the same object. Use
`.equals()` when you want to compare object content and the class
implements the appropriate equality behavior.

### 3.4 Logical and conditional operators

- `&&` --- logical AND, with short-circuit evaluation.
- `||` --- logical OR, with short-circuit evaluation.
- `!` --- logical NOT.
- `condition ? valueIfTrue : valueIfFalse` --- conditional (ternary)
  operator.

``` java
int age = 20;
boolean canEnter = age >= 18 && age < 100;

String category = age >= 18 ? "adult" : "minor";
```

With `&&`, the right-hand expression is not evaluated when the left-hand
expression is false. With `||`, it is not evaluated when the left-hand
expression is true.

### 3.5 `instanceof`

`instanceof` tests whether an object reference refers to an instance
compatible with a specified type:

``` java
if (value instanceof String) {
    String text = (String) value;
    System.out.println(text.length());
}
```

If `value` is `null`, the test evaluates to `false`.

## 4. Control Flow

### 4.1 `if` and `else`

Use `if` to execute a block conditionally:

``` java
int a = 1;
int b = 2;

if (a == b) {
    System.out.println("Equal");
} else {
    System.out.println("Not equal");
}
```

The condition must evaluate to a `boolean`.

### 4.2 `switch`

In Java 8, `switch` supports compatible integral types, `char`,
`String`, and enum values. A `break` usually prevents execution from
falling through into the next case.

``` java
String color = "Blue";
String shirt;

switch (color) {
    case "Blue":
        shirt = "Blue shirt";
        break;
    case "Red":
        shirt = "Red shirt";
        break;
    default:
        shirt = "White shirt";
        break;
}

System.out.println("Shirt type: " + shirt);
```

The `default` branch handles values not matched by another case.

### 4.3 `while`

A `while` loop checks its condition before each iteration. Its body may
execute zero times.

``` java
int x = 10;

while (x < 13) {
    System.out.println("Value of x: " + x);
    x++;
}
```

Ensure the loop can eventually stop; otherwise, it may run indefinitely.

### 4.4 `do-while`

A `do-while` loop checks its condition after executing the body, so the
body runs at least once.

``` java
int x = 10;

do {
    System.out.println("Value of x: " + x);
    x++;
} while (x < 13);
```

Notice the semicolon after the `while` condition.

### 4.5 Traditional `for`

A `for` loop groups initialization, continuation condition, and update
expression in one statement:

``` java
for (int i = 0; i < 10; i++) {
    System.out.println("i: " + i);
}
```

This prints values from `0` through `9`, because the loop stops when
`i < 10` becomes false.

### 4.6 Enhanced `for` loop

The enhanced `for` loop iterates over each element of an array or a
compatible iterable collection:

``` java
String[] names = {"John", "Jane", "Tom"};

for (String name : names) {
    System.out.println("Name: " + name);
}
```

Use it when you need each element and do not need to manage an index
explicitly.

## 5. Strings and Mutable Text

### 5.1 `String` is immutable

A `String` represents text and is immutable: operations that appear to
modify a string produce another string rather than changing the existing
object.

``` java
String first = "Hello";
String second = "World";

String combined = first + " " + second;
String alsoCombined = first.concat(" ").concat(second);

System.out.println(combined);
System.out.println(alsoCombined);
```

Both examples produce `Hello World`. The original `first` and `second`
strings remain unchanged.

String literals can be reused by the runtime through the string pool.
Consequently, two equal string literals may refer to the same object,
but code should not depend on reference identity to compare text.

### 5.2 Compare string content with `.equals()`

``` java
String first = new String("Test");
String second = new String("Test");

System.out.println(first == second);      // false: different references
System.out.println(first.equals(second)); // true: equal text
```

Use `==` to ask whether two references are the same reference. Use
`.equals()` to compare string content. If a string may be `null`, check
for null before calling a method on it.

### 5.3 `StringBuilder` is mutable

`StringBuilder` is useful when a sequence of text changes repeatedly,
especially when building text in a loop. It modifies its internal
character sequence rather than creating a new `String` for each append
operation.

``` java
StringBuilder builder = new StringBuilder("Hello");
builder.append(" World");
builder.append("! How are you?");

System.out.println(builder);
System.out.println("Length: " + builder.length());
System.out.println("Substring: " + builder.substring(0, 5));
```

The end index in `substring(start, end)` is exclusive. Therefore,
`substring(0, 5)` returns the characters at indexes `0` through `4`.

`StringBuilder.insert(index, text)` inserts text at the specified
position. The index must be within the valid range for the builder's
current length.

## 6. Classes, Objects, Fields, and Methods

### 6.1 Classes model concepts

A class defines the data and behavior that its instances share. For
example, an `Employee` class can represent an employee's identifier,
name, and salary.

``` java
public class Employee {
    private int employeeId;
    private String name;
    private double salary;

    public Employee() {
        // No-argument constructor.
    }

    public Employee(String name) {
        this.name = name;
    }

    public int getEmployeeId() {
        return employeeId;
    }
}
```

Fields hold an object's state. Methods define behavior or provide
controlled access to that state.

### 6.2 Creating an object

Use `new` to create an instance and invoke a constructor:

``` java
Employee employee = new Employee();
Employee namedEmployee = new Employee("John Smith");
```

The variable `employee` is a reference to an object; it is not the
object itself. In the first declaration, `new Employee()` constructs the
object and the returned reference is assigned to the variable.

### 6.3 Constructors

A constructor initializes a new object. Its name matches the class name,
and it has no return type---not even `void`.

``` java
public class Box {
    private final double length;
    private final double width;
    private final double height;

    public Box() {
        this(1.0, 1.0, 1.0);
    }

    public Box(double side) {
        this(side, side, side);
    }

    public Box(double length, double width, double height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    public double volume() {
        return length * width * height;
    }
}
```

This example demonstrates constructor overloading and constructor
chaining through `this(...)`. A call to `this(...)` must be the first
statement in the constructor.

If a class declares no constructors, Java supplies a default no-argument
constructor. If the class declares any constructor, Java does not
automatically supply that default constructor. A constructor is not
inherited by subclasses.

### 6.4 The `this` reference

Within an instance method or constructor, `this` refers to the current
object. It is commonly used to distinguish a field from a parameter with
the same name:

``` java
public Employee(String name) {
    this.name = name;
}
```

Here, `this.name` is the field and `name` is the constructor parameter.

### 6.5 Methods, getters, and setters

A getter returns information; a setter changes state. These are common
conventions, but they are not mandatory for every field. A class should
expose operations that make sense for its domain rather than
automatically creating a getter and setter for everything.

``` java
public class Employee {
    private int employeeId;

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        if (employeeId <= 0) {
            throw new IllegalArgumentException("Employee ID must be positive");
        }
        this.employeeId = employeeId;
    }
}
```

The validation protects the class from accepting an invalid identifier.
A `void` method performs an operation without returning a value; a
method with a non-`void` return type must return a compatible value on
every path that completes normally.

## 7. Packages and Imports

### 7.1 Packages

A package groups related types and gives them a namespace. For example:

``` java
package com.example.domain;

public class Employee {
}
```

The package declaration normally corresponds to a directory path such as
`com/example/domain` in a conventional source layout. The package name
contributes to a type's fully qualified name, such as
`com.example.domain.Employee`.

### 7.2 Imports

An `import` declaration lets source code refer to a type by its simple
name rather than writing its fully qualified name each time.

``` java
package com.example.app;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Example {
    private LocalDate startDate;
    private List<String> names = new ArrayList<String>();
}
```

Key points:

- The `package` declaration, if present, comes before imports.
- Imports come before type declarations.
- Types in `java.lang` are available without explicit imports.
- Types in the same package generally do not need to be imported.
- A wildcard import such as `java.util.*` imports accessible types in
  that package; it does not recursively import subpackages.
- Imports do not create an object relationship or a runtime dependency
  by themselves. They primarily make source-code names easier to
  write.

Use a valid type name such as `java.time.LocalDate`;
`java.util.LocalDate` is not the correct package for that class.

## 8. Encapsulation and Access Control

### 8.1 What encapsulation means

Encapsulation keeps an object's internal representation under the
control of the class and exposes a deliberate public interface. Clients
use the public operations without depending on implementation details.

Benefits include:

- The class can validate changes before accepting them.
- Invalid or inconsistent state is harder for callers to create.
- Internal implementation can change while the public contract remains
  stable.
- The class can express domain operations rather than exposing
  unrestricted field mutation.

A useful starting point is to make fields `private` and expose only the
methods that callers actually need. This does not mean every setter must
be removed in every class; the interface should reflect the class's
requirements.

### 8.2 Access levels

Java has four access levels for class members:

  -----------------------------------------------------------------------
Modifier General accessibility
  ----------------------------------- -----------------------------------
`private`                           Within the declaring top-level
class (including its nested members
under Java's access rules)

No modifier (package-private)       Within the same package

`protected`                         Within the same package, and under
subclass access rules in other
packages

`public`                            Wherever the declaring type and
member are otherwise accessible
  -----------------------------------------------------------------------

Top-level classes can be declared `public` or package-private; they
cannot be declared `private` or `protected`.

`protected` access across package boundaries has specific subclass
rules; it does not simply make a member public to every subclass-related
caller.

### 8.3 Encapsulating an employee

``` java
public class Employee {
    private final int employeeId;
    private final String socialSecurityNumber;
    private String name;
    private double salary;

    public Employee(int employeeId, String name,
                    String socialSecurityNumber, double salary) {
        if (employeeId <= 0) {
            throw new IllegalArgumentException("Employee ID must be positive");
        }
        if (salary < 0) {
            throw new IllegalArgumentException("Salary cannot be negative");
        }

        this.employeeId = employeeId;
        this.name = name;
        this.socialSecurityNumber = socialSecurityNumber;
        this.salary = salary;
    }

    public void changeName(String newName) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        name = newName;
    }

    public void increaseSalary(double amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Increase must not be negative");
        }
        salary += amount;
    }

    public double getSalary() {
        return salary;
    }
}
```

This class uses private fields, a constructor that establishes initial
state, and methods that express intended changes. `employeeId` and
`socialSecurityNumber` are `final`, so those fields cannot be reassigned
after construction. The example uses `double` for simplicity; financial
applications generally need an exact-decimal strategy, such as
`BigDecimal`, rather than binary floating-point arithmetic.

## 9. Inheritance and Subclassing

### 9.1 `extends`

Inheritance allows a subclass to specialize a superclass. A class can
extend only one direct superclass in Java, although it can implement
multiple interfaces.

``` java
public class Manager extends Employee {
    private final String departmentName;

    public Manager(int employeeId, String name,
                   String socialSecurityNumber, double salary,
                   String departmentName) {
        super(employeeId, name, socialSecurityNumber, salary);
        this.departmentName = departmentName;
    }

    public String getDepartmentName() {
        return departmentName;
    }
}
```

This example assumes the `Employee` class from the preceding section.
The `Manager` constructor passes the employee-related values to the
superclass constructor and initializes its own field.

### 9.2 The `super` keyword

`super(...)` invokes a superclass constructor. In Java 8, a constructor
invocation using `this(...)` or `super(...)` must be the first statement
in a constructor. If no explicit constructor invocation is written, Java
attempts to insert `super()`; this only compiles if the superclass has
an accessible no-argument constructor.

`super.methodName(...)` invokes the superclass implementation of an
instance method when needed. A subclass cannot directly access a
superclass's private fields or methods.

### 9.3 Inheritance and constructors

Constructors are not inherited. Each class declares the constructors
through which its own instances can be created. A subclass constructor
must ensure that its superclass portion is initialized, normally by
calling a superclass constructor.

Avoid assuming that `super()` is always valid: it fails when the
superclass has no accessible no-argument constructor.

### 9.4 Single inheritance and the diamond problem

Java classes have single inheritance: a class can extend only one class.
This avoids the classic ambiguity of inheriting competing
implementations through multiple superclass paths. Java supports
multiple interface implementation, with rules for resolving
default-method conflicts.

Inheritance should model a genuine "is-a" relationship, not be used
merely to reuse a few lines of code.

## 10. Overloading and Overriding

These terms describe different mechanisms.

### 10.1 Overloading

Overloading means declaring multiple methods or constructors with the
same name but different parameter lists. The parameter lists must differ
by number, types, or order of types. **Changing only the return type
does not create a valid overload.**

``` java
public class Printer {
    public void print(int value) {
        System.out.println(value);
    }

    public void print(double value) {
        System.out.println(value);
    }

    public void print(String value) {
        System.out.println(value);
    }

    public String print() {
        return "Nothing supplied";
    }
}
```

The compiler chooses the applicable overload based on the arguments at
the call site.

Constructors can also be overloaded:

``` java
public class Box {
    private final double length;
    private final double width;
    private final double height;

    public Box() {
        this(1.0, 1.0, 1.0);
    }

    public Box(double side) {
        this(side, side, side);
    }

    public Box(double length, double width, double height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    public double volume() {
        return length * width * height;
    }
}
```

### 10.2 Overriding

Overriding occurs when a subclass provides an implementation of an
inherited instance method with a compatible signature.

``` java
public class Manager extends Employee {
    private final String departmentName;

    public Manager(int employeeId, String name,
                   String socialSecurityNumber, double salary,
                   String departmentName) {
        super(employeeId, name, socialSecurityNumber, salary);
        this.departmentName = departmentName;
    }

    @Override
    public void increaseSalary(double amount) {
        super.increaseSalary(amount);
        System.out.println("Salary increase processed: " + amount);
    }
}
```

The `@Override` annotation asks the compiler to verify that the method
really overrides an inherited method. An overriding method cannot reduce
the visibility of the overridden method. It also must obey Java's
return-type and checked-exception compatibility rules.

The superclass call above passes `amount` to the original
implementation. Omitting the required argument would be a compile-time
error.

### 10.3 Quick comparison

  -----------------------------------------------------------------------
Overloading Overriding
  ----------------------------------- -----------------------------------
Same method name, different Subclass supplies a compatible
parameter lists implementation of an inherited
instance method

Usually resolved at compile time Instance method implementation is
selected dynamically at runtime

Can occur within one class Requires inheritance

Return type alone cannot Return type must be compatible with
distinguish overloads the overridden method
  -----------------------------------------------------------------------

## 11. Polymorphism and Virtual Method Invocation

Polymorphism allows code to work with a superclass or interface while
the runtime object supplies the specialized implementation of an
overridden instance method.

``` java
Employee employee = new Manager(
    101, "Jordan Lee", "011-22-3467", 120_000.0, "Engineering"
);

employee.increaseSalary(5_000.0);
```

The variable is declared as `Employee`, but the object is a `Manager`.
If `Manager` overrides `increaseSalary`, the `Manager` implementation is
invoked at runtime. This is dynamic dispatch, also known as virtual
method invocation.

The declared reference type determines which members can be called
without a cast. For example, `employee.getDepartmentName()` does not
compile if `getDepartmentName()` exists only on `Manager`, because the
compiler sees the variable as `Employee`. The runtime object's class
does not make subclass-only methods available through every superclass
reference.

### 11.1 Program to a general type

Prefer accepting the most general type that provides the operations a
method needs. This makes code easier to reuse:

``` java
public double calculateBonus(Employee employee) {
    return employee.getSalary() * 0.05;
}
```

This method can accept an `Employee` or a subclass instance. If bonus
behavior differs by employee type, polymorphism is often clearer than a
growing chain of type checks or overloaded methods.

## 12. The `instanceof` Operator

`instanceof` can test whether a reference refers to an instance of a
specified class or interface. It is useful when type-specific behavior
is genuinely needed, but extensive type checking can indicate that
polymorphism would model the behavior more cleanly.

``` java
if (employee instanceof Manager) {
    Manager manager = (Manager) employee;
    System.out.println(manager.getDepartmentName());
}
```

This is Java 8 syntax: the explicit cast is needed after the test. A
cast is safe here only if the test succeeds. If `employee` is `null`,
`employee instanceof Manager` is `false`.

For behavior that varies by subtype, consider defining an overridable
method in the superclass instead of asking external code to inspect each
subtype.

## 13. Java Passes Arguments by Value

Java is always pass-by-value. The key is understanding what value is
copied.

### 13.1 Primitive values

``` java
int x = 3;
int y = x;

y = 10;

System.out.println(x); // 3
System.out.println(y); // 10
```

The value `3` is copied into `y`. Changing `y` does not change `x`.

### 13.2 Object references

Variables that refer to objects hold reference values. Assigning one
reference variable to another copies the reference value, so both
variables can refer to the same object:

``` java
Employee first = new Employee(
    101, "Jordan Lee", "011-22-3467", 120_000.0
);
Employee second = first;
```

Both variables now refer to the same `Employee` object. Mutating that
object through either reference can be observed through the other
reference.

### 13.3 Passing an object to a method

``` java
public void updateEmployee(Employee employee) {
    employee.increaseSalary(10_000.0);
}
```

The method receives a copy of the reference value. It can use that
copied reference to mutate the same object, but assigning a new object
to the parameter does not replace the caller's variable.

``` java
public void example(Employee employee) {
    employee.increaseSalary(10_000.0); // Mutates the caller's object.

    employee = new Employee(
        202, "New Employee", "111-22-3333", 50_000.0
    ); // Only reassigns this local parameter.
}
```

After the method returns, the caller's variable still refers to its
original object, although that object's salary was changed by the first
statement.

## 14. Garbage Collection and Object Reachability

Java manages memory automatically. When an object is no longer reachable
from any live execution path or other GC root, it may become eligible
for garbage collection.

``` java
public class Example {
    public static void createTemporaryEmployee() {
        Employee employee = new Employee(
            101, "Jordan Lee", "011-22-3467", 120_000.0
        );
        // Use employee here.
    }
}
```

When the method returns, its local variable is no longer available. If
no other reference to that object exists, the object may be eligible for
collection. The exact time of collection is not guaranteed.

Assigning `null` to a variable removes that variable's reference to the
object, but it does not guarantee collection:

``` java
Employee employee = new Employee(
    101, "Jordan Lee", "011-22-3467", 120_000.0
);
employee = null;
```

If another live reference still points to the object, it remains
reachable. Garbage collection reclaims memory; it is not a substitute
for releasing external resources such as files or database connections,
which should be managed with the appropriate APIs.

## 15. Object-Oriented Programming: Four Core Concepts

The four concepts commonly introduced in object-oriented programming
are:

1. **Encapsulation** --- control access to internal state and expose a
   clear interface.
2. **Inheritance** --- define a specialized class from an existing
   class.
3. **Polymorphism** --- use a common type while allowing
   implementations to vary by runtime type.
4. **Abstraction** --- expose essential behavior while hiding
   unnecessary implementation detail.

These concepts overlap in practice. A well-designed class often uses
encapsulation and abstraction, while inheritance and polymorphism help
model variations where a genuine subtype relationship exists.

## 16. Common Mistakes and Corrections

### 16.1 Comparing strings with `==`

Incorrect for content comparison:

``` java
if (first == second) {
    // This tests whether both references point to the same object.
}
```

Use:

``` java
if (first.equals(second)) {
    // This tests string content.
}
```

If `first` could be `null`, use a null-safe comparison such as
`"expected".equals(first)`.

### 16.2 Starting an array loop at index 1

The first array element is at index `0`. This loop skips the first
value:

``` java
for (int i = 1; i < values.length; i++) {
    // Starts at the second element.
}
```

A corrected average method is:

``` java
public static double average(int[] values) {
    if (values == null || values.length == 0) {
        throw new IllegalArgumentException("Values must not be empty");
    }

    long total = 0;
    for (int value : values) {
        total += value;
    }

    return (double) total / values.length;
}
```

For `{100, 200, 300}`, this returns `200.0`. The original example
started at index `1`, so it skipped `100` and produced an incorrect
result.

### 16.3 Overloading by return type alone

These two methods cannot coexist as overloads:

``` java
// Invalid overload pair:
public int calculate() { return 1; }
// public double calculate() { return 1.0; }
```

They have the same name and parameter list. Change the parameter list or
use a different method name.

### 16.4 Assuming subclass-only methods are available through a superclass reference

``` java
Employee employee = new Manager(
    101, "Jordan Lee", "011-22-3467", 120_000.0, "Engineering"
);

// Does not compile if getDepartmentName() exists only on Manager:
// employee.getDepartmentName();
```

Use a `Manager` reference when manager-specific behavior is required, or
check the type and cast when that is appropriate.

### 16.5 Assuming `null` immediately frees memory

`reference = null` only removes that reference. Collection depends on
whether the object remains reachable elsewhere, and the collector
decides when to reclaim eligible memory.

## 17. Key Takeaways

- Java programs organize behavior and state into types such as
  classes.
- The conventional application entry point is
  `public static void main(String[] args)`.
- Primitive variables hold primitive values; object variables hold
  reference values.
- `String` is immutable; `StringBuilder` supports mutable text
  construction.
- Constructors initialize objects. They are not inherited, and a
  default no-argument constructor is supplied only when no constructor
  is declared.
- Encapsulation protects class invariants by controlling access to
  state.
- Overloading uses different parameter lists; overriding replaces an
  inherited instance method implementation.
- Polymorphism enables runtime dispatch through a general reference
  type.
- Java is pass-by-value, including when the copied value is an object
  reference.
- Garbage collection is based on reachability and does not promise
  immediate reclamation.