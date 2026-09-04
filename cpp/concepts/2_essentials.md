# **Setting Out to C++**

Learning C++ is like building a home: you start with a solid **foundation** (program structure) before adding details.
If the foundation is weak, later steps become difficult or error-prone. Understanding the **core structure of a C++
program** is essential before moving on to functions, classes, and templates.

## **C++ Initiation – The Essentials**

A C++ program is constructed from **functions**, which are the fundamental building blocks. Programs are typically
**organized into tasks**, and **each task is implemented in a separate function**.

Key rules:

* C++ program is **a collection of functions, and each function is a collection of statements**.
* **A statement represents an action to be taken**.
* **Every statement must end with a semicolon (`;`)**, which terminates the statement.
* **Every standalone C++ program must contain a function named `main()`**.
* **Execution always begins at `main()`**.
* C++ is **case-sensitive**: `main`, `Main`, and `MAIN` are all different.
* **Function headers define the interface**: what a function returns and what arguments it accepts.
* **Function bodies define the implementation**: the instructions executed by the function.
* **Comments document the program** but are ignored by the compiler.

Example program structure:

```cpp
#include <iostream>

int main() 
{
    // Output a message
    std::cout << "Hello, C++!" << std::endl;

    // Return value to the operating system
    return 0;
}
```

## **Function Definition**

A function consists of three parts:

1. **Function header** – defines the interface
2. **Function body** – contains the instructions
3. **Return statement** – optionally returns a value to the caller

**General form:**

```cpp
return_type function_name(parameter_list)
{
    // statements
}
```

### **Function Header – The Interface**

The **function header** specifies how a function interacts with its caller. It contains:

* **Return type** – the type of value returned (e.g., `int`, `void`)
* **Parameter list** – values passed to the function

Example:

```cpp
int main()
```

* `int` → function returns an integer to the caller (usually the OS)
* `()` → function takes no arguments

Explicit form:

```cpp
int main(void)
```

Both forms are equivalent in C++.

### **Function Body – The Implementation**

The **function body** is enclosed in `{ }` and contains all **statements** that define what the function does.

Example:

```cpp
int main()
{
    int x = 5;                              // variable declaration
    std::cout << "x = " << x << std::endl;  // output statement
    return 0;                               // return statement
}
```

> The function header defines **what a function can do**, while the body defines **how it does it**.

### **The `main()` Function**

`main()` is **mandatory for standalone programs** and serves as the **entry point of execution**.

* Standard form:

```cpp
int main()
{
    std::cout << "Program starts here." << std::endl;
    return 0;
}
```

* If the `main()` function ends without a return statement, the compiler **implicitly assumes**:

```cpp
return 0;
```

* Avoid non-standard forms like:

```cpp
void main()
```

### **Statements**

A **statement** represents an action to be taken. To understand your source code, a compiler needs to know when one
statement ends and another begins. C++, like C, uses a semicolon as a terminator rather than as a separator. The
difference is that a **semicolon acting as a terminator is part of the statement rather than a marker between
statements**. The practical upshot is that in C++ you should never omit the semicolon.

* A **statement** is a complete instruction in C++.
* Typically, an **expression followed by a semicolon**.
* The **semicolon is a terminator**, marking the end of the statement.

Example:

```cpp
std::cout << "Hello, World!";
```

**Rules:**

* Never omit the semicolon.
* Each statement represents **an action performed by the program**.

### **Comments – Documenting Your Code**

A comment is a **remark from the programmer to the reader** that usually identifies a section of a program or explains
some aspect of the code. Comments are **for humans only**; The compiler ignores comments.

> You should use comments to document your programs. The more complex the program, the more valuable comments are. Not
> only do they help others to understand what you have done, but also they help you understand what you’ve done,
> especially if you haven’t looked at the program for a while.

#### **Single-line C++ style**

```cpp
// This is a single-line comment
```

#### **Multi-line C style**

```cpp
/* 
    This is a multi-line comment
    that can span multiple lines
*/
```

**Best practice:**
Prefer **C++ style comments (`//`)** for clarity and to avoid errors.

### **The C++ Preprocessor and the iostream File**

Before a C++ program is compiled, it passes through a step called **preprocessing**. This is handled by the **C++
preprocessor**, a special program that prepares your source code for compilation. You don’t have to run it manually; it
operates automatically when you compile your program.

The preprocessor performs tasks such as:

* **Including other files** into your source code
* **Defining constants or macros** that can be used throughout your program
* **Conditionally compiling parts of your code** based on certain criteria

Think of it as a **text processor** that transforms your source file before the compiler actually translates it into
machine code. This happens **before compilation**, so the compiler sees a complete file that already includes everything
the program needs.

For example, if your program uses the standard C++ input/output facilities, you typically start with these lines:

```cpp
#include <iostream>
using namespace std;
```

* `#include <iostream>` tells the preprocessor to **insert the contents of the iostream file** into your program. This
  file provides the definitions for standard input and output objects like `cin` and `cout`.
* `using namespace std;` makes the names defined in the `std` namespace, such as `cout` and `endl`, available without
  writing `std::` each time.

By including `iostream`, your program gains access to facilities that allow it to **communicate with the outside
world**, such as displaying output to the screen or receiving input from the user.

Essentially, the preprocessor **combines your source code with these definitions** so that the compiler can generate a
working executable.

### **The `#include` Directive**

```cpp
#include <iostream>  // a PREPROCESSOR directive
```

This directive causes the preprocessor to **add the contents of the iostream file** to your program. Essentially, the
contents of the iostream file replace the `#include <iostream>` line in your source code, forming a composite file that
is sent to the compiler.

The **iostream** file provides definitions needed for input and output operations, including the `cout` object used to
display messages. Programs that use `cin` and `cout` must include the iostream file.

### **Header Filenames**

Files such as iostream are called **include files** (because they are included in other files) or **header files** (
because they appear at the beginning of a file).

C++ compilers come with many header files, each supporting particular facilities. Traditionally, C header files used the
`.h` extension (e.g., `math.h`). Early C++ used the same convention (e.g., `iostream.h`), but now:

* C++ header files have **no extension** (e.g., `iostream`)
* Converted C headers use the **c prefix** and no `.h` (e.g., `cmath` for `math.h`)
* Old C headers with `.h` are still usable

| Kind of Header | Convention     | Example    | Comments                                         |
|----------------|----------------|------------|--------------------------------------------------|
| C++ old style  | Ends in .h     | iostream.h | Usable by C++ programs                           |
| C old style    | Ends in .h     | math.h     | Usable by C and C++ programs                     |
| C++ new style  | No extension   | iostream   | Usable by C++ programs, uses `namespace std`     |
| Converted C    | c prefix, no h | cmath      | Usable by C++ programs, might use non-C features |

### **Namespaces and Name Conflicts**

C++ uses **namespaces** to help organize programs and avoid **naming conflicts**, especially in large programs or when
combining code from different sources.

Suppose you use two prepackaged products that both have a function called `wanda()`. Without namespaces, the compiler
would not know which version you mean. Namespaces allow you to **disambiguate** by specifying which version to use:

```cpp
Microflop::wanda("go dancing?");    // uses Microflop's wanda
Piscine::wanda("a fish named Desire"); // uses Piscine's wanda
```

In this example, `Microflop` and `Piscine` are **namespaces**. By qualifying `wanda()` with a namespace, the compiler
can distinguish between the two.

The **C++ standard library** also uses a namespace, called `std`. For example, the `cout` object used for output is
actually `std::cout`, and the `endl` manipulator is `std::endl`:

```cpp
std::cout << "Come up and C++ me some time.";
std::cout << std::endl;
```

To simplify code, you can use a **using directive**:

```cpp
using namespace std;
cout << "Come up and C++ me some time." << endl;
```

This makes all names in the `std` namespace available without writing `std::` each time.

> Modern practice prefers importing only the specific names you need:

```cpp
using std::cout;
using std::endl;
using std::cin;
```

This avoids potential conflicts in larger programs, while still giving you easy access to commonly used library names.

### **C++ Output with cout**

The simplest way to display a message in C++ is using the `cout` object:

```cpp
cout << "Come up and C++ me some time.";
```

* The **string in double quotes** is the message to print.
* The `<<` symbol is called the **insertion operator**, which sends the string to `cout`.
* `cout` is a **predefined object** representing the output stream to the screen.

In C++, output represents a **stream of characters** flowing from your program. The `cout` object knows how to display
strings, numbers, and other data types. You do not need to know the internal workings of `cout`; you just use its *
*interface**, which in this case is the insertion operator `<<`. The insertion operator indicates that the statement is
sending the string to `cout`. The symbol points the way the information flows.

#### **Operator Overloading**

You may notice that `<<` looks like the **bitwise left-shift operator**. This is an example of **operator overloading**,
where the same operator can have different meanings depending on the context. C++ resolves which meaning to use
automatically.

### **The endl Manipulator**

To move the cursor to the next line, you can use the `endl` manipulator:

```cpp
cout << endl;
```

* `endl` is defined in `iostream` and is part of the `std` namespace.
* Unlike `\n`, which simply adds a newline character, `endl` also **flushes the output**, ensuring it appears on the
  screen immediately.

Example:

```cpp
cout << "Hello, world!" << endl;
cout << "Welcome to C++." << endl;
```

* If you omit `endl` or `\n`, output continues immediately after the previous text:

```cpp
cout << "The Good, the";
cout << "Bad, ";
cout << "and the Ukulele" << endl;
```

Output:

```
The Good, theBad, and the Ukulele
```

> To include spaces between strings, you must add them explicitly inside the string.

### **The Newline Character**

C++ also supports the **older C-style newline**, `\n`:

```cpp
cout << "Pluto is a dwarf planet.\n";
```

* `\n` is a single character representing the newline.
* When displaying a string, using `\n` often requires less typing than `endl`.
* For standalone newlines, both `\n` and `endl` work, but `endl` guarantees the output is flushed immediately.

### **C++ Input with `cin`**

Just as C++ treats **output** as a **stream of characters flowing out of the program**, it treats **input** as a *
*stream of characters flowing into the program**. The **iostream** file defines `cin` as an object representing this
input stream.

For output, the `<<` operator **inserts characters into the output stream**. For input, `cin` uses the `>>` operator to
**extract characters from the input stream**. Typically, you provide a **variable on the right-hand side** of the
operator to **receive the extracted information**.

The `<<` and `>>` symbols were chosen to visually suggest the **direction in which information flows**:

* `cout << "Hello";` → flows **out** of the program
* `cin >> age;` → flows **into** the program

Like `cout`, `cin` is a **smart object**. It **converts the raw input**—which is just a series of characters typed from
the keyboard—into a form that can be stored in the **variable receiving the information**. For example:

```cpp
#include <iostream>
using namespace std;

int main() {
    int age;

    cout << "Enter your age: ";
    cin >> age;  // cin reads the input and stores it in 'age'

    cout << "You entered: " << age << endl;
    return 0;
}
```

* In this example, `cin` **extracts the characters typed by the user**, converts them into an integer, and stores the
  value in the variable `age`.

> In essence, `cin` allows your program to **receive information from the outside world**, just as `cout` allows it to
**send information out**.

### Tokens and White Space in Source Code

The **indivisible elements** in a line of code are called **tokens**. Generally, you must separate one token from the
next with a space, tab, or carriage return, which collectively are termed **white space**. Some single characters, such
as parentheses and commas, are tokens that need not be set off by white space.

## **C++ Statements**

A C++ program is a **collection of functions**, and each function is a **collection of statements**. A statement
represents an **action to be taken** by the program.

C++ has several kinds of statements:

### **Declaration Statement**

A **declaration statement** creates a **variable**, indicating the **type of memory storage** and providing a **label
for the storage location**. The label is the name we use to identify the value stored at that location. Computers are
precise, orderly machines. To store an item of information in a computer, you must specify both **where it is stored**
and **how much memory space it occupies**. The C++ style for declaring variables is to declare a variable as close to
its first use as possible.

Example:

```cpp
int age;        // declares a variable named 'age' that can store an integer
double price;   // declares a variable named 'price' that can store a floating-point number
```

* The **type** (e.g., `int`, `double`) tells the computer how much memory to allocate and what kind of values the
  variable can hold.
* The **variable name** is a label that you use to access the storage location.

### **Assignment Statement**

An **assignment statement** assigns a **value to a storage location**. After a variable is declared, you can assign it a
value so that the program can use it in calculations or display it. The symbol `=` is called the assignment operator.

Example:

```cpp
age = 25;       // assigns the value 25 to the variable 'age'
price = 19.99;  // assigns the value 19.99 to the variable 'price'

int steinway;
int baldwin;
int yamaha;

// The assignment works from right to left. 
// First, 88 is assigned to steinway; 
// then the value of steinway, which is now 88, is assigned to baldwin; 
// then baldwin’s value of 88 is assigned to yamaha.
yamaha = baldwin = steinway = 88; 
```

* The **left-hand side** of the `=` operator is the variable to receive the value.
* The **right-hand side** is the value or expression to be stored in the variable.

You can also **declare and assign a variable in a single statement**:

```cpp
int year = 2026;       // declares 'year' and assigns it the value 2026
double taxRate = 0.07; // declares 'taxRate' and assigns it 0.07
```

1. **Declaration statements** tell the computer **what to store and where**.
2. **Assignment statements** tell the computer **what value to store**.
3. Together, declarations and assignments allow your program to **remember and manipulate data**.

## Functions

A **C++ program is a collection of functions**, and each function is itself a sequence of statements that performs a
particular task. Functions allow you to **modularize your code**, making programs easier to read, maintain, and reuse.
Functions are also essential for defining **classes and objects** in object-oriented programming.

### **Function Components**

Every C++ function has two primary components:

1. **Function Header** – The function header defines the **interface** of the function. It specifies:
    - The **return type**: the type of value the function will send back. Examples include `int`, `double`, or `void` if
      the function does not return a value.
    - The **function name**: the identifier used to call the function.
    - The **parameter list**: variables that the function expects as input, also called **parameters**.

   **Example:**

   ```cpp
   double sqrt(double x);  // Function prototype / header
   ```

   Here, `double` before `sqrt` indicates that the function returns a `double` value. The `double x` inside the
   parentheses specifies that the function expects one argument of type `double`.

2. **Function Body** – The function body is enclosed in braces `{ }` and contains the **implementation**, i.e., the
   statements that define the task performed by the function.

   **Example:**

   ```cpp
   void simon(int n) {
       cout << "Simon says touch your toes " << n << " times." << endl;
   }
   ```

### **Function Call, Arguments, and Return Values**

* **Function Call** – This is an expression that invokes a function. When a function is called, the program temporarily
  transfers control to that function.
* **Calling Function** – The function from which the call is made.
* **Called Function** – The function being executed.
* **Arguments and Parameters**:
    * **Parameter**: A variable in the function header that receives a value from the caller.
    * **Argument**: The actual value passed to the function during a call.

**Example:**

```cpp
void simon(int n);  // Function prototype
simon(3);           // Function call; 3 is the argument, n is the parameter
```

* **Return Value** – The value sent back from a function to its caller. Only functions with a non-`void` return type
  produce a return value. The return value can be assigned to a variable or used in expressions.

**Example:**

```cpp
double x;
x = sqrt(6.25);  // sqrt() returns 2.5, which is assigned to x
```

**Tip:** Think of the return value as what **replaces the function call** in an expression once the function finishes
executing.

### **Function Prototype**

A **function prototype** declares the function’s interface **before it is used** in a program. The compiler needs to
know the types of arguments the function expects and the type of value it returns. Without a prototype, the compiler
cannot interpret the function call correctly.

* The prototype is similar to a **variable declaration** but for a function.
* You can provide a prototype in two ways:

    1. Type it explicitly in your source file.
    2. Include the appropriate **header file**, which contains the prototypes for standard library functions.

**Example:**

```cpp
double sqrt(double);  // Prototype for sqrt()
#include <cmath>       // Header file automatically provides the prototype
```

**Tip:** The semicolon at the end of a prototype distinguishes it from a function definition. Without the semicolon, the
compiler expects a function body.

### **Library Functions**

C++ provides a rich set of **predefined functions** in its standard libraries. These functions are stored in **library
files**, and the compiler searches these libraries when compiling a program.

* Different compilers may automatically search some library files, but in some cases, you need to explicitly link
  libraries (e.g., using `-lm` for math functions in Unix/Linux).
* Including a header file gives access to **prototypes** but does not necessarily link the compiled code; you may still
  need to instruct the compiler to link the correct library.

**Examples of library functions**:

* `sqrt()` – returns the square root of a number.
* `pow()` – takes two arguments and returns the first argument raised to the power of the second.
* `rand()` – generates a random integer; takes no arguments.

**Function Call Examples:**

```cpp
double x = sqrt(25.0);   // single argument
double y = pow(5.0, 8.0); // two arguments
int r = rand();            // no arguments
```

### **User-Defined Functions**

While library functions are convenient, many programs require **custom functions**. You define your own functions by
providing:

1. **Function prototype** – usually before `main()`.
2. **Function definition** – the implementation, usually after `main()`.
3. **Function calls** – to invoke the function from `main()` or other functions.

**Example:**

```cpp
#include <iostream>
using namespace std;

void simon(int n);  // Prototype

int main() {
    simon(3);  // Call with literal
    int count;
    cout << "Pick an integer: ";
    cin >> count;
    simon(count); // Call with variable
    return 0;
}

void simon(int n) {  // Definition
    cout << "Simon says touch your toes " << n << " times." << endl;
}
```

**Notes:**

* Each function is independent; **C++ does not allow nested function definitions**.
* `void` functions do not return a value and cannot be used in assignments or expressions.
* Functions with return values must use the `return` keyword to send a value back.

### **Function Variations**

* **Functions with return values** – Produce a value used in the calling function.
* **Functions without return values (`void`)** – Perform tasks without sending back data.
* **Functions with multiple arguments** – Take more than one input separated by commas.

  ```cpp
  double pow(double base, double exponent);
  ```
* **Functions with no arguments** – Use `void` in the prototype.

  ```cpp
  int rand(void); 
  ```

**Tip:** Even functions with no arguments require parentheses when called in C++.

### **Main Function**

* `main()` is the **entry point of every C++ program**.
* Its header is usually `int main()`; it returns an integer to the operating system.
* `return 0;` signals **successful execution**, whereas non-zero return values indicate errors or abnormal termination.

**Tip:** The operating system, not another function, “calls” main(). This return value can be used by shell scripts or
batch files.

### **Keywords in Functions**

* **C++ keywords** used in functions include `int`, `void`, `double`, and `return`.
* Keywords **cannot** be used as identifiers for variables or functions.
* Function names (like `main`, `simon`, `sqrt`) and object names (like `cout`, `cin`) are **not keywords**, but using
  the same name for both a variable and an object in the same scope can confuse the compiler.

### **Important Notes and Tips**

* Always provide **function prototypes** before their first use.
* Library functions are precompiled; you only need the header to declare prototypes.
* You can **initialize variables at declaration**, even using a function call:

  ```cpp
  double side = sqrt(area);
  ```
* `cin` automatically converts input to the variable’s type; `cout` handles output formatting.
* Functions make programs modular; **each function should perform one clear task**.

## Summary

A C++ program consists of one or more modules called **functions**. Programs begin executing at the beginning of the
function called `main()` (all lowercase), so you should always have a function by this name. A function, in turn,
consists of a **header** and a **body**.

* The **function header** tells you what kind of return value, if any, the function produces and what sort of
  information it expects arguments to pass to it.
* The **function body** consists of a series of C++ statements enclosed in paired braces (`{}`).

C++ statement types include the following:

* **Declaration statement** — A declaration statement announces the name and the type of variable used in a function.
* **Assignment statement** — An assignment statement uses the assignment operator (`=`) to assign a value to a variable.
* **Message statement** — A message statement sends a message to an object, initiating some sort of action.
* **Function call** — A function call activates a function. When the called function terminates, the program returns to
  the statement in the calling function immediately following the function call.
* **Function prototype** — A function prototype declares the return type for a function, along with the number and type
  of arguments the function expects.
* **Return statement** — A return statement sends a value from a called function back to the calling function.

A **class** is a user-defined specification for a data type. This specification details how information is to be
represented and also the operations that can be performed with the data. An **object** is an entity created according to
a class prescription, just as a simple variable is an entity created according to a data type description.

C++ provides two predefined objects (`cin` and `cout`) for handling input and output. They are examples of the `istream`
and `ostream` classes, which are defined in the `iostream` file. These classes view input and output as streams of
characters.

* The **insertion operator (`<<`)**, which is defined for the `ostream` class, lets you insert data into the output
  stream.
* The **extraction operator (`>>`)**, which is defined for the `istream` class, lets you extract information from the
  input stream.

Both `cin` and `cout` are **smart objects**, capable of automatically converting information from one form to another
according to the program context.

Use `cin.ignore()` when switching from **formatted input** to **line input** (read whole line) to handle leftover
newline characters when mixing `cin >>` and `cin.getline()` or `getline()`.

C++ can use the extensive set of **C library functions**. To use a library function, you should include the **header
file** that provides the prototype for the function.
