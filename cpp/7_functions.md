# C++ Functions: Programming Modules

Functions are the fundamental building blocks (modules) of C++ programs. They encapsulate specific tasks, improving code
readability, reuse, and maintainability. This chapter covers the core concepts of function use, design, and advanced C++
features such as templates, overloading, and recursion, together with mechanisms for passing data (by value, by
reference, and via pointers).

## Function basics

To use a C++ function, three elements are required:

- A **function prototype** (or function interface).
- A **function definition** (or implementation).
- A **function call** from some other context (e.g., `main()`).


```cpp
// 1. Function prototype
void simple();

// 2. Function definition
void simple() {
    using namespace std;
    cout << "Hello world!";
}

// 3. Function call
int main() {
    simple();
    return 0;
}
```

The prototype is not strictly mandatory if the definition appears before the first use. However, modern C++ style
usually places `main()` first, treating it as the program’s top‑level structure.

***

## Function prototypes

### Why prototypes are used

A function prototype describes the **interface** of a function to the compiler:

- The **return type** the function produces.
- The **number and types** of its parameters.

Prototypes decouple declaration from definition, enabling:

- Calling functions before their code is written.
- Placing `main()` at the top of the source file while definitions appear later.
- Efficient compilation because the compiler can check calls statically.

If no prototype is used, the function definition must appear textually before the first call.

### Prototype syntax

A prototype is a **statement**, so it ends with a semicolon:

```cpp
void helloWorld();              // no parameters
void cheers(int);               // one int parameter
int sum(int, int);              // two int parameters, no names
int sum(int n1, int n2);        // same, but with names (optional)
```

Key points:

- Parameter **names** in prototypes are optional; only types matter to the compiler.
- Names, when present, serve as documentation and can help distinguish between same‑type parameters.
- Names in the prototype do **not** have to match those in the definition.

### What prototypes enforce

Prototypes enable **static type checking** at compile time:

- The compiler verifies that the **number** of arguments matches.
- The compiler checks that argument **types** are compatible.
- If types differ but are convertible, the compiler performs **implicit conversions** (e.g., `int` → `double`).

This early checking catches many errors that would otherwise be found only at runtime.

***

## Function definitions

Functions fall into two main categories:

- **Functions without return values** (`void`).
- **Functions with return values** (`non‑void`).

### `void` functions

A `void` function does not return a value to the caller. Its general form is:

```cpp
void functionName(parameterList) {
    statement(s);
    return;   // optional
}
```

The `return` statement is optional because the function returns automatically when reaching the closing brace.

### Functions with return values

A function with a return value yields a result to the calling context. The general form is:

```cpp
typeName functionName(parameterList) {
    statement(s);
    return value;   // mandatory
}
```

Constraints:

- `value` must have (or be convertible to) type `typeName`.
- The return type **cannot be an array**.
- It can be any scalar type, pointer, class object, or aggregate (e.g., `int`, `double`, `int*`, `std::string`,
  `struct`).

A function terminates immediately when it executes a `return` statement. If a function contains multiple `return`
statements, only the first one encountered during execution takes effect.

***

## Function default parameters

A **default argument** is a value used automatically if the corresponding actual argument is omitted in the call.

### Requirements and rules

- Default arguments must be specified in the **prototype**, not in the definition.
- The compiler uses the prototype to determine how many arguments each call should supply.
- You must add defaults **from right to left**. That is, if a parameter has a default, all parameters to its right must
  also have defaults.

Example:

```cpp
void cheers(const char* greet = "Hello World");
int sum(int n1, int n2 = 2, int n3 = 3);
```

Valid calls:

```cpp
cheers();           // uses default "Hello World"
cheers("Hi");       // overrides default

sum(1);             // n1=1, n2=2, n3=3
sum(1, 4);          // n1=1, n2=4, n3=3
sum(1, 4, 5);       // n1=1, n2=4, n3=5
```

Default arguments are a convenience; they reduce the number of overloads needed in class design and API definitions.

***

## Function overloading (function polymorphism)

C++ supports **function overloading**, also called **function polymorphism**: multiple functions can share the same name
as long as they have **different signatures**.

### Key concepts

- The **function signature** is the parameter list (number, types, and order of parameters).
- Variable names in the parameter list are irrelevant for overload resolution.
- Two functions with identical signatures are illegal; overload resolution is based solely on the parameter list.

Overloaded functions enable the same logical operation on different data types or forms.

### Simple overloading example

```cpp
void print(const char* str, int width);      // #1
void print(double d, int width);             // #2
void print(long l, int width);               // #3
void print(int i, int width);                // #4
void print(const char* str);                 // #5
```

Overload resolution:

```cpp
print("Pancakes", 15);   // matches #1
print("Syrup");          // matches #5
print(1999.0, 10);       // matches #2
print(1999, 12);         // matches #4
print(1999L, 15);        // matches #3
```

### Overloading with reference parameters

Overloading interacts with reference qualifiers:

```cpp
void sink(double& r1);                    // modifiable lvalue
void sank(const double& r2);              // const or modifiable lvalue, rvalue
void sunk(double&& r3);                   // rvalue
```

Overload resolution selects the **best match**:

```cpp
double x = 55.5;
const double y = 32.0;

sunk(x);          // calls sink(double&)
sunk(y);          // calls sank(const double&)
sunk(x + y);      // calls sunk(double&&)
```

### Guidelines for overloading

- Use overloading only when the functions perform the **same conceptual task** on different data forms.
- Prefer **default arguments** if the same behavior can be achieved with a single overload.
- Avoid “clever” overloads that confuse callers.

***

## Function templates

Function templates define **generic algorithms** parameterized by type. They are a core mechanism of **generic
programming** in C++.

### Basic template syntax

```cpp
template <typename AnyType>
void Swap(AnyType& a, AnyType& b) {
    AnyType temp;
    temp = a;
    a = b;
    b = temp;
}
```

Key words:

- `template` and `typename` are required.
- `typename` can be replaced by `class` (legacy style, meaning “type parameter”).
- The angle brackets `<...>` enclose the template parameter list.

The template itself does **not** create executable code. Instead, it provides a **pattern**; when the compiler
encounters a call such as:

```cpp
int x = 10, y = 20;
Swap(x, y);          // instantiates Swap<int>
```

it generates a concrete function `Swap<int>` by substituting `int` for `AnyType`.

### When to use templates

- Use templates when the same algorithm applies to **multiple types**.
- Prefer templates to writing many hand‑coded overloads for the same logic.
- Prefer `typename` over `class` for modern C++ style (they are semantically equivalent for type parameters).

***

### Overloaded templates

You can overload templates just as you overload ordinary functions:

```cpp
template <typename T>
void print(T value);              // generic print

template <typename T>
void print(T value, int width);   // specialized for width
```

Overloaded templates must differ in **signature** (number or type of template or function parameters).

### Template limitations, instantiations, and specializations

- Templates are instantiated per argument type at compile time.
- Some operations (e.g., pointer arithmetic, certain operators) are not defined for all types and may break generic
  code.
- **Explicit specializations** allow giving a tailored definition for a specific type:

```cpp
template <>
void print<bool>(bool b);         // explicit specialization for bool
```

These constructs are essential for building robust, reusable libraries.

***

## Inline functions

C++ allows the `inline` keyword to suggest that a function be expanded **in place** instead of being called via a normal
jump.

Basic form:

```cpp
inline void smallHelper() {
    // short, frequently called code
}
```

Effects:

- The compiler may replace calls to `smallHelper()` with the body’s statements.
- This reduces function‑call overhead but can increase code size.
- `inline` is a **suggestion**, not a guarantee; the compiler decides whether to inline.

Guidelines:

- Use `inline` mainly for **short, simple** helper functions.
- Do **not** inline large or complex functions.

***

## Recursive functions

A recursive function calls itself. Recursion is a powerful tool for problems that naturally divide into smaller
subproblems.

### Recursive structure

A typical recursive `void` function has this pattern:

```cpp
void recurs(argumentList) {
    statements1;
    if (test) {
        recurs(arguments);
    }
    statements2;
}
```

Mechanics:

- As long as `test` is true, each recursive call executes `statements1` and then invokes another instance of `recurs`,
  without reaching `statements2`.
- When `test` becomes false, the innermost call executes `statements2` and returns.
- Control unwinds back through the call stack, executing `statements2` in reverse order.

### Multiple recursive calls

Recursion is especially useful for **divide‑and‑conquer** algorithms:

```cpp
void divide(int n) {
    if (n > 1) {
        divide(n / 2);      // left subproblem
        divide(n / 2);      // right subproblem
    }
    // process n
}
```

Such patterns are common in tree traversal, sorting, and dynamic programming.

***

## The `auto` keyword

`auto` lets the compiler deduce the type of variable from its initializer:

```cpp
auto x = 42;          // x is int
auto y = 3.14;        // y is double
auto z = "text";      // z is const char*
```

In function contexts, `auto` can be used in C++14 and later for **return type deduction**:

```cpp
auto multiply(int a, int b) {
    return a * b;       // deduced as int
}
```

`auto` improves code readability when types are long or complex (e.g., iterators, nested templates).

***

## The `typedef` keyword (and `using` aliases)

`typedef` creates an alias for a type:

```cpp
typedef int Number;
typedef char* CStr;
```

Then:

```cpp
Number x = 100;      // x is int
CStr s = "string";   // s is char*
```

Modern C++ prefers `using` for type aliases:

```cpp
using Number = int;
using CStr = char*;
```

Both approaches enhance abstraction and maintainability.

***

## References and aliases

A **reference** is an alias for an existing variable:

```cpp
int x = 10;
int &ref = x;        // ref is an alias for x
ref = 20;            // x becomes 20
```

Key points:

- A reference must be initialized and cannot be reseated.
- References are mainly used as **function parameters** to avoid copying large objects.
- A reference of base type can bind to a derived‑class object (e.g., `ostream&` can bind to `ofstream`).

***

## Passing arguments by value

C++ passes arguments **by value** by default:

```cpp
void f(int param) {
    param = 42;       // modifies local copy
}

int main() {
    int x = 10;
    f(x);             // x is unchanged
}
```

Semantics:

- The **actual argument** value is copied into the **formal parameter**.
- The function works with a **copy**, so the original data is protected.
- Such parameters are **local** (automatic) variables: memory is allocated on call and released on return.

Terminology:

- **Formal parameter** (formal argument): the parameter name in the function definition.
- **Actual argument** (actual parameter): the expression used in the call.

***

## Passing arguments by reference

Passing by reference allows the function to modify the caller’s data:

```cpp
void increment(int& ref) {
    ref++;              // modifies the original
}

int main() {
    int x = 5;
    increment(x);       // x becomes 6
}
```

Patterns:

- Use `typeName &` for modifiable references.
- Use `const typeName &` for read‑only references to large objects.
- This avoids copying while still preserving data integrity when needed.

***

## Pointers to functions

Every function has an address (the starting address of its compiled code). You can pass this address as an argument.

### Obtaining a function’s address

Simply use the function name without parentheses:

```cpp
void process(void (*pf)(int));   // pf is function pointer
void think(int);

process(think);                  // passes address of think
```

Distinction:

```cpp
process(think);      // passes address
thought(think());    // calls think, passes its return value
```

### Declaring a function pointer

A function pointer must encode the **return type** and **signature**:

```cpp
double pam(int);

double (*pf)(int);   // pf points to function taking int, returning double
pf = pam;            // assign function address
```

Analogy:

- Write the prototype, then replace the function name with `(*pf)`.

### Invoking via a pointer

Use `(*pf)` or `pf` followed by arguments:

```cpp
double x = pam(4);        // normal call
double y = (*pf)(5);      // via pointer
double z = pf(6);         // allowed by C++ compromise
```

This mechanism enables **strategy‑style** designs (e.g., policy functions, callback‐style estimators).

***

## Designing functions to process arrays

C++ treats an array name as a **pointer to its first element**:

```cpp
void show(int arr[], int size);      // arr is pointer to int
void show(int* arr, int size);       // equivalent declaration
```

### Array notation and pointers

Inside the function you can use array‑style syntax:

```cpp
void show(int* arr, int size) {
    for (int i = 0; i < size; ++i) {
        cout << arr[i];   // arr[i] ≡ *(arr + i)
    }
}
```

### `const` and pointer parameters

To protect data:

```cpp
void show(const int* arr, int size);     // read‑only
void revalue(int* arr, int size);        // modifiable
```

### Typical array utilities

Common patterns:

- `fill_array(arr, size)` – populate an array.
- `show_array(arr, size)` – display its contents.
- `revalue_array(arr, size, factor)` – scale or transform elements.

### Passing array ranges

Instead of a size, many STL‑style algorithms pass two pointers:

```cpp
void process_range(int* begin, int* end) {
    while (begin != end) {
        // process *begin
        ++begin;
    }
}
```

This pattern matches how STL algorithms work with iterators.

***

## Designing functions to process two‑dimensional arrays

For fixed‑size 2D arrays, the function must know the **number of columns**:

```cpp
void show_2d(int arr[][COLS], int rows);
void show_2d(int (*arr)[COLS], int rows);   // equivalent

void show_2d(int arr[ROWS][COLS], int rows, int cols); // screw CPP i prefer this explicit
```

Access:

```cpp
arr[i][j]    // element at row i, column j
```

Dynamic‑size 2D arrays are often handled via **pointer‑to‑pointer** or `std::vector<std::vector<T>>`.

***

## Designing functions to process C‑strings

C‑strings are null‑terminated character sequences:

```cpp
void greet(const char* name);      // const char* -> const char[]*
```

### C‑style string processing

Common idioms:

```cpp
void print_string(const char* str) {
    while (*str) {
        cout << *str++;
    }
}
```

C++ passes character arrays, string literals, and `char*` pointers uniformly as `const char*` arguments.

### Functions returning C‑style strings

C‑style string functions often return `char*` or `const char*` to newly allocated or static storage:

```cpp
char* format_name(const char* first, const char* last);
```

Care must be taken with **lifetime** and **ownership** of returned strings.

***

## Designing functions to process structures

C++ treats structures like built‑in types:

```cpp
struct Point { int x, y; };

void print(Point p);                // pass by value
Point midpoint(Point a, Point b);   // return by value
```

### Passing structure addresses

For efficiency with large structures:

```cpp
void print(const Point& p);   // pass by const reference
void modify(Point* p);        // pass by pointer
```

Same considerations apply to **class objects**.

***

## Designing functions to process class objects

C++ functions can receive and return objects of user‑defined classes in the same way as structures, but with additional
considerations for constructors, destructors, and operators.

### Functions and `std::string` objects

The `std::string` class provides a safer, higher‑level alternative to C‑strings:

```cpp
#include <string>
using std::string;

void print(const string& s) {
    for (char c : s) {
        cout << c;
    }
}

string format(const string& first, const string& last) {
    return first + " " + last;
}
```

Advantages:

- `string::size()` gives the length without null‑terminator checks.
- Automatic memory management and bounds safety.
- Built‑in operators (`+`, `==`, `<`, etc.) simplify manipulation.

### Functions and `std::array` or `std::vector`

C++ containers such as `std::array` and `std::vector` are typically passed by reference or `const` reference:

```cpp
#include <vector>

void scale(std::vector<double>& vec, double factor) {
    for (double& x : vec) {
        x *= factor;
    }
}

void print(const std::vector<int>& vec) {
    for (int x : vec) {
        cout << x << " ";
    }
}
```

This avoids expensive copying while preserving data integrity when needed.

***

## Memory and local variables

Variables declared inside a function are **local variables** (also called **automatic variables**):

- They are allocated when the function is called.
- They are deallocated when the function returns.
- They are private to the function’s scope.

### Scope and lifetime

Example:

```cpp
int helper() {
    int temp = 42;    // local variable
    return temp * 2;
}
```

After `helper()` returns, `temp` no longer exists; only its return value is communicated back.

### Static local variables

A `static` local variable persists between calls:

```cpp
void counter() {
    static int count = 0;
    ++count;
    cout << "Count: " << count << "\n";
}
```

- `count` is initialized only once.
- Its value is preserved across invocations.

***

## Function design principles

### Single responsibility

Each function should perform **one well‑defined task**. For example:

- `read_data()` – reads input.
- `compute_average()` – processes data.
- `display_result()` – outputs formatted result.

This makes testing and reuse easier.

### Parameter design

- Prefer **const references** for large, read‑only objects.
- Use **pointers** when modification via `nullptr` logic is needed.
- Use **value** for small, trivial types (e.g., `int`, `double`).

### Error handling

- Use **return codes** (e.g., `bool success`) or exceptions where appropriate.
- Document preconditions and side effects clearly in comments or documentation.

***

## Summary

Functions are the C++ programming modules. To use a function, you must provide a **definition** and a **prototype**, and
you must issue a **function call**. The function definition contains the code that implements the function’s behavior.
The function prototype describes the function interface: how many and what kinds of values to pass to the function and
what sort of return type, if any, to obtain from it. The function call causes the program to pass the function arguments
to the function and transfer execution to the function code.

By default, C++ functions pass arguments **by value**. This means the formal parameters in the function definition are
new variables initialized from the values supplied by the function call. Thus, C++ functions protect the integrity of
the original data by working with copies. However, C++ treats an array name argument as the address of the first element
of the array. Technically this is still passing by value, because the pointer is a copy of the original address, but the
function uses the pointer to access the contents of the original array. When you declare formal parameters for a
function (and only then), the following two declarations are equivalent:

- `typeName arr[]`
- `typeName* arr`

Both mean that `arr` is a pointer to `typeName`. In the function you can use `arr` as if it were an array name to access
elements: `arr[i]`. Even when passing pointers, you can preserve the integrity of the original data by declaring the
formal argument as a pointer to `const` type. Because passing the address of an array conveys no information about the
size of the array, you normally pass the array size as a separate argument. Alternatively, you can pass pointers to the
beginning of the array and to one position past the end to indicate a range, as STL algorithms do.

C++ provides three ways to represent C‑style strings: a character array, a string constant, or a pointer to a string.
All are `char*` (pointer‑to‑char), so they are passed as `char*` arguments. C++ uses the null character (`\0`) to
terminate strings, and string functions test for this character to determine the end of any string they process. C++
also provides the `std::string` class. A function can accept `std::string` objects as arguments and use a `std::string`
object as a return value. The `std::string::size()` method can be used to determine the length of a stored string.

C++ treats structures the same as basic types: you can pass them by value and use them as function return types.
However, if a structure is large, it may be more efficient to pass a pointer to the structure and let the function work
with the original data. These same considerations apply to class objects.

A C++ function can be **recursive**; that is, the code for a function can include a call of itself. The name of a C++
function acts as the address of the function. By using a function parameter that is a pointer to a function, you can
pass to a function the name of a second function that you want the first function to call.

C++ has expanded C function capabilities via the **inline** keyword. By placing an `inline` keyword on a short function
definition and positioning that definition before the first call, you suggest the compiler embed the function code
inline instead of generating a separate call. This should be used only when the function is short.

A **reference** variable is a kind of disguised pointer that lets you create an **alias** (a second name) for a
variable. References are primarily used as arguments to functions that process structures and class objects. An
identifier declared as a reference to a particular type normally refers only to data of that type. However, when one
class is derived from another (e.g., `ofstream` from `ostream`), a reference to the base type may also refer to the
derived type.

C++ prototypes enable **default arguments**. If a function call omits the corresponding argument, the program uses the
default value; if the function includes an actual argument, the program uses that value instead of the default. Default
arguments can be provided only from right to left in the argument list. Thus, if you provide a default for a particular
argument, you must also provide defaults for all arguments to its right.

A function’s **signature** is its parameter list. You can define two functions having the same name, provided that they
have different signatures. This is called **function polymorphism** or **function overloading**. Typically, you overload
functions to provide essentially the same service to different data types.

**Function templates** automate the process of overloading functions. You define a function in terms of a generic type
and a particular algorithm, and the compiler generates appropriate function definitions for the particular argument
types used in a program. This mechanism underlies much of modern C++ generic programming and library design.