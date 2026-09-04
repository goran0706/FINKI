# Compound Types

## **Arrays**

An **array** is a data form that can hold several values, all of **one type**. Each value is stored in a separate
**array element**, and the computer stores all elements **consecutively in memory**.

### **Declaration**

```cpp
typeName arrayName[arraySize];
```

An array declaration must indicate three things:

- **The type** of value to be stored in each element
- **The name** of the array
- **The number of elements** in the array

```cpp
short months[12];   // array of 12 shorts
float loans[20];    // array of 20 floats

const SIZE = 10;
int numbers[SIZE];  // array of 10 integers
```

Each element is a variable that you can treat as a simple variable.

**`arraySize`** must be an integer constant, a `const` value, or a constant expression such as `8 * sizeof(int)` — all
values must be known at **compile time**. The **`arraySize` cannot be a runtime variable.** The `new` operator can be
used to get around the compile-time size restriction.

An array is a **compound type** — built from some other type. C uses the term *derived type*, but C++ reserves *derived*
for class relationships. You cannot declare something as just "an array" — it must always be **an array of a specific
type**. There is no generalized array type:

```cpp
float loans[20];   // type is "array of float", not just "array"
```

There are only specific array types — array of `char`, array of `long`, array of `float`, and so on.

### **Accessing Elements**

Elements are accessed using a **subscript (index)** in brackets. **C++ array numbering starts at zero** — this is
non-negotiable.

```cpp
months[0]    // first element
months[11]   // last element of a 12-element array
```

**The index of the last element is always one less than the array size.** An array declaration lets you create many
variables with a single declaration, each identified and accessed by index.

> ⚠️ **The compiler does not check for valid subscript values.** Accessing `months[101]` produces no compile error — but
> at runtime it may **corrupt data**, **corrupt code**, or **abort the program**. Valid index ranges are **your
responsibility**.

### **Initialization**

An array is initialized with a **comma-separated list enclosed in braces**. Spaces in the list are optional. An array
defined inside a function that is **not initialized** contains **undefined values** — whatever previously resided at
that memory location.

**Initialization rules:**

- **Only valid at definition** — the brace form cannot be used later
- **One array cannot be assigned wholesale to another**
- **Individual elements can be assigned using indices**

```cpp
int cards[4] = {3, 6, 8, 10};       // ✅ valid
int hand[4];                        // ✅ valid
hand[4] = {5, 6, 7, 9};             // ❌ not allowed
hand = cards;                       // ❌ not allowed
```

**Partial initialization** — fewer values than elements can be provided. The compiler sets **remaining elements to
zero**:

```cpp
float hotelTips[5] = {5.0, 2.5};   // remaining 3 elements = 0
long totals[500]   = {0};           // all 500 elements = 0
```

> Initializing to `{1}` instead of `{0}` sets **only the first element** to `1` — the rest are still `0`.

**Empty brackets** — the compiler counts the elements automatically:

```cpp
short things[] = {1, 5, 3, 8};                      // compiler determines size = 4
int num_elements = sizeof things / sizeof(short);    // retrieve size at runtime
```

> ⚠️ Letting the compiler count is generally **poor practice** — accidentally omitting a value produces a wrong count
> silently. It is safe only when initializing a character array to a string. Whether this approach is useful or lazy
> depends on the circumstances.

### **C++11 Initialization**

C++11 makes **list-initialization** universal for all types. Arrays already used it, but C++11 adds three new features:

**1 — The `=` sign can be dropped:**

```cpp
double earnings[4] {1.2e4, 1.6e4, 1.1e4, 1.7e4};   // ✅ C++11
```

**2 — Empty braces zero-initialize all elements:**

```cpp
unsigned int counts[10] = {};   // all elements = 0
float balances[100] {};         // all elements = 0
```

**3 — Narrowing is prohibited:**

```cpp
long plifs[] = {25, 92, 3.0};              // ❌ floating-point to integer is narrowing
char slifs[4] {'h', 'i', 1122011, '\0'};   // ❌ 1122011 exceeds range of char
char tlifs[4] {'h', 'i', 112, '\0'};       // ✅ 112 fits within char range
```

- The first fails because **floating-point to integer conversion is narrowing**, even with zeros after the decimal point
- The second fails because **`1122011` exceeds the range** of an 8-bit `char`
- The third succeeds because **`112` fits within `char` range**, even though it is an `int` value

> The C++ **STL** provides `vector` as a more flexible array alternative, and C++11 adds the `array` template class.
> Both are more sophisticated than the built-in array type.

### **`sizeof` with Arrays**

`sizeof` returns the size **in bytes of a type or data object**:

| Expression            | Returns                             |
|-----------------------|-------------------------------------|
| `sizeof arrayName`    | Total bytes of the **entire array** |
| `sizeof arrayName[i]` | Bytes of a **single element**       |

```cpp
short months[12];
sizeof months      // 24 bytes — entire array (12 × 2)
sizeof months[1]   //  2 bytes — one short
```

`months` is an array — `months[1]` is just a `short`.

## Strings

### **C-Style Strings**

A **string** is a series of characters stored in **consecutive bytes of memory**. Since characters are stored
consecutively, a string can be stored in an **array of `char`**, with each character in its own array element.

**C-style strings have one special feature: the last character of every string is the null character `\0`** — the
character with ASCII code 0, which marks the string's end.

```cpp
char dog[8] = { 'b', 'e', 'a', 'u', 'x', ' ', 'I', 'I'};    // ❌ not a string!
char cat[8] = {'f', 'a', 't', 'e', 's', 's', 'a', '\0'};    // ✅ a string!
```

Both are arrays of `char`, but only `cat` is a string. The **null character plays a fundamental role** — C++ functions
that handle strings, including `cout`, process characters one by one until they reach `\0`. If you tell `cout` to
display `cat`, it displays the first seven characters, detects `\0`, and stops. If you tell `cout` to display `dog` —
which is **not a string** — it prints the eight characters and then **keeps marching through memory byte-by-byte**,
interpreting each byte as a character, until it stumbles upon a null character. Because null characters (bytes set to
zero) tend to be common in memory, the damage is usually contained quickly — nonetheless, **you should never treat
non-string character arrays as strings**.

### **String Literals**

Initializing an array character-by-character with a null terminator is tedious. A better way is to use a
**quoted string**, also called a **string constant** or **string literal**:

```cpp
char bird[11] = "Mr. Cheeps";   // \0 is understood
char fish[]   = "Bubbles";      // let the compiler count
```

**Quoted strings always include the terminating null character implicitly** — you don't have to spell it out. C++ input
facilities that read a string from keyboard input into a `char` array also add the terminating null character
automatically.

The array must be large enough to hold all characters of the string, **including the null character**. There is no harm,
other than wasted space, in making an array larger than the string — functions that work with strings are guided by the
**location of the null character**, not by the size of the array. C++ imposes **no limits on the length of a string**.

> ⚠️ **When determining the minimum array size to hold a string, always include the terminating null character in your
count.**

### **String Constant vs Character Constant**

A **string constant** (double quotes) is **not interchangeable** with a **character constant** (single quotes):

- `'S'` is a character constant — a shorthand notation for the numeric code of a character. On an ASCII system, `'S'` is
  just another way of writing `83`:

```cpp
char shirt_size = 'S';    // ✅ assigns 83 to shirt_size
```

- `"S"` is **not a character constant** — it represents a string consisting of two characters: `S` and `\0`. Worse,
  `"S"` actually represents the **memory address** at which the string is stored:

```cpp
char shirt_size = "S";    // ❌ illegal type mismatch — "S" is an address, not a char
```

A C++ compiler won't allow this because an address is a separate type.

### **Concatenating String Literals**

C++ lets you **concatenate string literals** — any two quoted strings separated only by whitespace (spaces, tabs, or
newlines) are automatically joined into one:

```cpp
cout << "I'd give my right arm to be" " a great violinist.\n";
cout << "I'd give my right arm to be a great violinist.\n";
cout << "I'd give my right ar"
        "m to be a great violinist.\n";
```

All three statements are equivalent. The join **adds no spaces** — the first character of the second string immediately
follows the last character (not counting `\0`) of the first string. The `\0` from the first string is replaced by the
first character of the second string.

### **Using Strings in an Array**

The two most common ways to get a string into an array are:

- **Initialize an array to a string constant**
- **Read keyboard or file input into an array**

`sizeof` gives the size of the **entire array**, but `strlen()` returns the length of the **string stored in the array
** — counting only visible characters, not the null character:

```cpp
const int ArSize = 15;
char name[ArSize] = "Basicman";

sizeof(name)    // 15 — size of the entire array
strlen(name)    //  8 — length of "Basicman", null not counted
```

The minimum array size to hold a string is **`strlen(string) + 1`** — the `+1` accounts for `\0`.

You can also shorten a string by placing a `\0` earlier in the array — everything after the new null character is
ignored by string functions:

```cpp
const int ArSize = 15;
char name2[ArSize] = "C++owboy";
name2[3] = '\0';   // string is now "C++" — rest is ignored
```

### **Reading String Input**

#### **Word-Oriented Input — `cin >>`**

`cin >>` reads one word at a time, stopping at any whitespace. To read whole phrases, a **line-oriented** approach is
needed.

#### **Line-Oriented Input — `getline()`**

`getline()` reads an entire line, using the newline character from the Enter key to mark the end of input. It takes two
arguments:

- **The target array** to hold the input
- **A character limit** — reads at most `n - 1` characters, leaving room for `\0`

```cpp
cin.getline(name, 20);   // reads up to 19 characters into name
```

`getline()` stops reading when it hits the character limit or a newline, **whichever comes first**. It **reads and
discards the newline**, replacing it with `\0` when storing the string.

#### **Line-Oriented Input — `get()`**

`get()` works much like `getline()` — same arguments, same interpretation, reads to end of line. The key difference:
**`get()` leaves the newline character in the input queue** instead of discarding it.

This creates a problem with consecutive calls — the second call sees the leftover newline and concludes it has reached
the end of a line without reading anything. The fix is `cin.get()` with no arguments, which reads the **single next
character**, even if it is a newline:

```cpp
cin.get(name, ArSize);    // read first line
cin.get();                // discard newline
cin.get(dessert, ArSize); // read second line
```

These calls can also be **concatenated** — `cin.get(name, ArSize)` returns the `cin` object, which then invokes the next
`get()`:

```cpp
cin.get(name, ArSize).get();   // read line, then discard newline
```

**Why use `get()` instead of `getline()`?**

- Older implementations may not have `getline()`
- `get()` makes **error checking simpler** — if the next character after a read is not a newline, there is still more
  input on that line. `getline()` is simpler to use; `get()` gives more control

#### **Empty Lines and Other Problems**

After `getline()` or `get()` reads an empty line, the original practice was that the next input statement picked up
where the last one left off. The **current practice** is that after `get()` reads an empty line, it sets the
**failbit**, blocking further input. Input can be restored with:

```cpp
cin.clear();
```

If the input string is **longer than the allocated space**:

- Both `getline()` and `get()` leave the remaining characters in the input queue
- **`getline()` additionally sets the failbit** and turns off further input

### **Mixing String and Numeric Input**

Mixing numeric input with line-oriented string input can cause problems. When `cin` reads a number, it **leaves the
newline in the input queue**. The next `cin.getline()` call reads that newline as an empty line and assigns a null
string to the array. The fix is to read and discard the newline before reading the string:

```cpp
cin >> year;
cin.get();                 // discard newline
```

Or concatenated, using the fact that `cin >> year` returns the `cin` object:

```cpp
(cin >> year).get();       // read year, then discard newline
```

> C++ programs frequently use **pointers instead of arrays** to handle strings.

## **The `string` Class**

The ISO/ANSI C++98 Standard added a **`string` class** to the C++ library. Instead of using a character array to hold a
string, you can use a **`string` type variable** (or *object*, in C++ terminology). The `string` class is simpler to use
than arrays and provides a truer representation of a string as a type.

To use the `string` class, a program must include the **`string` header file**. The `string` class is part of the `std`
namespace, so you must provide a `using` directive, a `using` declaration, or refer to it as `std::string`. The class
definition **hides the array nature of a string** and lets you treat a string much like an ordinary variable.

### **Declaring and Initializing**

A `string` object is declared as a **simple variable**, not as an array:

```cpp
string str1;                  // empty string object — length 0
string str2 = "panther";      // initialized string object
```

C++11 also enables **list-initialization** for both C-style strings and `string` objects:

```cpp
char first_date[]  = {"Le Chapon Dodu"};
char second_date[] {"The Elegant Plate"};
string third_date  = {"The Bread Bowl"};
string fourth_date {"Hank's Fine Eats"};
```

### **Automatic Sizing**

The class design **handles sizing automatically**. The declaration for `str1` creates a string object of length zero,
but the program automatically resizes `str1` when it reads input:

```cpp
string str;   // empty string object — length 0
cin >> str;   // str resized to fit input
```

This makes using a `string` object both **more convenient and safer** than using an array. Conceptually, an array of
`char` is a collection of storage units used to hold a string, whereas a `string` class variable is a **single entity
representing the string**.

### **What `string` and `char` Arrays Have in Common**

In many ways, a `string` object can be used in the same manner as a character array:

- **Initialize** a `string` object to a C-style string
- **Use `cin`** to store keyboard input in a `string` object
- **Use `cout`** to display a `string` object
- **Use array notation** to access individual characters stored in a `string` object

### **Assignment, Concatenation, and Appending**

The `string` class makes several operations simpler than with arrays. **You cannot assign one array to another**, but
you can assign one `string` object to another:

```cpp
char charr1[20];
char charr2[20] = "jaguar";
string str1;
string str2     = "panther";

charr1 = charr2;   // ❌ invalid — no array assignment
str1   = str2;     // ✅ valid — object assignment
```

**Concatenation and appending** use the `+` and `+=` operators:

```cpp
string str3;
str3  = str1 + str2;   // assign str3 the joined strings
str1 += str2;          // append str2 to the end of str1
```

### **`string` Class vs C Library String Functions**

Before the `string` class existed, C-style string operations relied on functions from the **`cstring`** header (formerly
`string.h`):

```cpp
strcpy(charr1, charr2);   // copy charr2 to charr1
strcat(charr1, charr2);   // append charr2 to charr1
```

These functions are **unsafe** — `strcat()` will attempt to copy all characters into the target array, potentially
**overrunning adjacent memory**, causing the program to abort or producing corrupted data. The C library provides safer
variants `strncat()` and `strncpy()` that take a third argument for maximum target size, but using them adds complexity.
The `string` class **avoids all of this** with automatic resizing.

**Getting the length** of a string uses different syntax depending on type:

```cpp
int len1 = str1.size();      // string object — dot notation
int len2 = strlen(charr1);   // C-style string — function argument
```

`strlen()` is a regular function that takes a C-style string as its argument. `size()` does the same thing but uses *
*dot notation** — `str1` precedes the function name, connected with a dot, indicating that `str1` is an object and
`size()` is a **class method**. A method is a function that can be invoked only by an object belonging to the same
class. C functions identify which string to use via a **function argument**; C++ `string` objects use the **object name
and dot operator**.

### **`string` Class I/O**

`cin >>` and `cout <<` work with `string` objects using the same syntax as C-style strings. However, **reading a line at
a time uses different syntax**:

```cpp
cin.getline(charr, 20);   // reading a line into a char array
getline(cin, str);        // reading a line into a string object
```

**Key differences:**

- `cin.getline()` uses **dot notation** — it is a class method of `istream`, takes the destination array as the first
  argument and array size as the second
- `getline(cin, str)` uses **no dot notation** — it is not a class method, so it takes `cin` as an argument to indicate
  the input source. There is **no size argument** because the `string` object automatically resizes to fit

**Why are there two different `getline()` functions?** The `istream` class was part of C++ long before the `string`
class was added. `istream` recognizes basic C++ types such as `double` and `int`, but is **ignorant of the `string`
type**. There are `istream` class methods for processing basic types, but none for processing `string` objects.

**Why does `cin >> str` work then?** Code like `cin >> x` for basic types uses a **member function** of the `istream`
class. The `string` class equivalent uses a **friend function** of the `string` class instead. Both use disguised
notation — you can use `cin` and `cout` with `string` objects without worrying about the inner workings.

### **Uninitialized Behavior**

```cpp
char charr[20];
string str;

strlen(charr)   // unpredictable — could return 27 or any value
str.size()      // always 0 — uninitialized string objects are set to zero size
```

An **uninitialized array** has undefined contents. `strlen()` starts at the first element and counts bytes until it
finds a null character — which may not appear until several bytes past the end of the array, producing an unpredictable
result. An **uninitialized `string` object** is automatically set to zero size — safe and predictable.

## **Structures**

An **array** can hold several items, but every item must be the **same type**. A **structure** solves this — it can hold
items of **more than one data type** in a single unit. This makes it possible to store all related data — a person's
name, age, height, weight — in a single structure variable. If you want to track many people, you can use an **array of
structures**. The structure type is also a **stepping stone to the C++ class** — learning structures now brings you
closer to the OOP heart of C++.

### **Defining a Structure**

Creating a structure is a **two-part process**:

1. **Define a structure description** — describes and labels the different types of data the structure can hold
2. **Create structure variables** that follow the description's plan

A structure is a **user-definable type**, with the structure declaration serving to define the type's data properties:

```cpp
struct Person
{
    char   name[50];
    int    age;
    double height;   // in meters
};
```

- The **`struct`** keyword indicates the code defines a structure layout
- **`Person`** is the **tag** — the name for the new type
- Between the braces is the list of **structure members**, each a declaration statement
- Any C++ type can be used for members, including arrays and other structures

### **Declaring Structure Variables**

Once defined, structure variables are created just like any other type. In C++, the `struct` keyword is **not required**
when declaring variables — the tag alone serves as the type name:

```cpp
struct Person alice;   // keyword struct required in C
Person bob;            // keyword struct not required in C++
```

This change emphasizes that a structure declaration **defines a new type**, making it consistent with how fundamental
types are used.

### **Accessing Members**

The **membership operator (`.`)** accesses individual members of a structure:

```cpp
bob.age      // age member of bob
bob.height   // height member of bob
alice.name   // name member of alice
```

Each member behaves as a variable of its declared type — `bob.age` is an `int`, `bob.height` is a `double`, `alice.name`
is an array of `char`. Because `alice.name` is a character array, individual characters can be accessed with
subscripts — `alice.name[0]` is valid, but `alice[0]` is **not** — `alice` is a structure, not an array. The dot
operator used to access class member functions like `cin.getline()` has its origins in this same structure member access
syntax.

### **Initialization**

Structure members are initialized with a **comma-separated list enclosed in braces**, one value per member in order:

```cpp
Person bob = {"Bob Smith", 30, 1.85};
```

Each member is initialized to the appropriate type — `name` is a character array initialized to a string, `age` to an
`int`, `height` to a `double`.

**C++11** extends list-initialization for structures:

- **The `=` sign is optional:**

```cpp
Person bob {"Bob Smith", 30, 1.85};   // ✅ C++11
```

- **Empty braces zero-initialize all members:**

```cpp
Person unknown {};   // unknown.age = 0, unknown.height = 0.0, unknown.name = all zeros
```

- **Narrowing is not allowed**

### **Structure Placement — Local vs External**

A structure declaration can be placed **inside** or **outside** a function:

- **External declaration** — placed outside any function, usable by **all functions** in the file
- **Internal declaration** — placed inside a function, usable **only within that function**

Most often an **external structure declaration** is the right choice so that all functions can use the type. C++
discourages external variables but **encourages external structure declarations**. It also often makes sense to declare
symbolic constants externally. In other languages this is known as global vs. local scope.

### **Other Structure Properties**

C++ makes user-defined types as similar as possible to built-in types:

- **Structures can be passed as function arguments** and returned from functions
- **Assignment with `=`** copies every member from one structure to another of the same type — even array members. This
  is called **memberwise assignment**:

```cpp
Person alice = {"Alice Jones", 28, 1.70};
Person copy;

copy = alice;   // copy.name, copy.age, copy.height all set to alice's values
```

A structure definition and variable creation can be **combined**:

```cpp
struct Point
{
    int x;
    int y;
} origin, cursor;   // two Point variables created immediately
```

A variable created this way can also be initialized:

```cpp
struct Point
{
    int x;
    int y;
} origin = {0, 0};
```

However, **keeping structure definitions separate from variable declarations** usually makes code easier to read.

A structure can also be created with **no type name** by omitting the tag:

```cpp
struct
{
    double latitude;
    double longitude;
} currentPosition;   // no tag — only one variable of this type can ever be created
```

`currentPosition.latitude` and `currentPosition.longitude` are accessible, but because there is no type name, **no
further variables of the same type can be created**. This limited form is rarely used.

Unlike C structures, **C++ structures can have member functions** in addition to member variables — but these advanced
features are more typically used with classes.

### **Can a Structure Use a `string` Class Member?**

Yes — a structure member can be declared as `std::string` instead of a character array:

```cpp
#include <string>
struct Person
{
    std::string name;
    int         age;
    double      height;
};
```

The structure definition must have access to the `std` namespace — either by declaring `name` as `std::string`
explicitly, or by placing a `using` directive above the structure definition.

### **Arrays of Structures**

An array whose elements are structures is created the same way as any other array:

```cpp
Person team[100];   // array of 100 Person structures
```

`team` is an **array**, not a structure — `team.age` is **not valid**. Each element such as `team[0]` is a `Person`
object, accessed with the membership operator:

```cpp
cin >> team[0].age;
cout << team[0].name << endl;
```

**Initializing an array of structures** combines both initialization rules — an outer brace-enclosed list for the array,
with an inner brace-enclosed list for each structure's members:

```cpp
Person team[3] =
{
    {"Alice Jones", 28, 1.70},
    {"Bob Smith",   30, 1.85},
    {"Carol White", 25, 1.65}
};
```

### **Bit Fields in Structures**

C++ allows structure members that occupy a **specific number of bits**. This is useful for creating data structures that
correspond to hardware registers or network packet headers where every bit matters. The field type must be an **integral
or enumeration type**, with a colon followed by the number of bits:

```cpp
struct NetworkFlags
{
    unsigned int version  : 4;   // 4 bits for protocol version
    unsigned int          : 4;   // 4 bits unused — padding
    bool         syn      : 1;   // 1 bit — synchronize flag
    bool         ack      : 1;   // 1 bit — acknowledge flag
    bool         fin      : 1;   // 1 bit — finish flag
};
```

Bit fields are initialized and accessed using standard structure notation:

```cpp
NetworkFlags packet = {2, true, false, false};
if (packet.syn) ...
```

> Bit fields are typically used in **low-level programming**. Using an integral type with **bitwise operators** provides
> an alternative approach.

## **Unions**

A **union** is a data format that can hold different data types but **only one type at a time**. Whereas a structure can
hold an `int` *and* a `double` *and* a `char` simultaneously, a union can hold an `int` *or* a `double` *or* a `char` —
but never more than one at a time. The syntax is like that of a structure, but the meaning is different.

### **Declaration and Usage**

```cpp
union Value
{
    int    int_val;
    float  float_val;
    double double_val;
};
```

A `Value` variable can hold an `int`, a `float`, or a `double` — as long as only one is used at a time. The **member
name identifies the capacity** in which the variable is currently acting:

```cpp
Value data;
data.int_val   = 15;      // storing an int
data.double_val = 3.14;   // storing a double — int value is lost
```

Because a union holds only one value at a time, it must have enough space to hold its **largest member**. The **size of
a union equals the size of its largest member**.

### **Practical Use — Saving Memory**

One use for a union is to **save space** when a data item can use two or more formats but never simultaneously. For
example, a product in an inventory system might have either a numeric ID or a string ID, but never both:

```cpp
struct Product
{
    char brand[20];
    int  type;
    union id
    {
        long id_num;       // type 1 products — numeric ID
        char id_char[20];  // type 2 products — string ID
    } id_val;
};

Product item;

if (item.type == 1)
    cin >> item.id_val.id_num;
else
    cin >> item.id_val.id_char;
```

### **Anonymous Unions**

An **anonymous union** has no tag name — its members become variables that **share the same address** directly within
the enclosing structure. The intermediate identifier is eliminated:

```cpp
struct Product
{
    char brand[20];
    int  type;
    union                  // anonymous union
    {
        long id_num;       // type 1 products
        char id_char[20];  // type 2 products
    };
};

Product item;

if (item.type == 1)
    cin >> item.id_num;    // no intermediate identifier needed
else
    cin >> item.id_char;
```

Because the union is anonymous, `id_num` and `id_char` are treated as direct members of `Product` that share the same
address. **It is the programmer's responsibility to track which member is currently active.**

### **When Unions Are Used**

Unions are typically used in two situations:

- **Saving memory** — when a variable needs to represent different types at different times, a union avoids allocating
  space for all of them simultaneously. This may seem trivial with modern systems having gigabytes of RAM, but C++ is
  also used for **embedded systems** — processors controlling devices like industrial sensors, automotive controllers,
  or medical equipment — where memory is extremely limited
- **Working with OS or hardware data structures** — unions are common when interfacing with hardware registers or
  operating system structures where the same block of memory needs to be interpreted in different ways

## **Enumerations**

The **`enum`** facility provides an alternative to `const` for creating symbolic constants, and lets you define new
types in a restricted fashion. Consider the following:

```cpp
enum Direction { north, south, east, west };
```

This statement does two things:

- Makes **`Direction`** the name of a new type — called an **enumeration**
- Establishes `north`, `south`, `east`, and `west` as **symbolic constants** (called **enumerators**) for the integer
  values `0`, `1`, `2`, and `3`

### **Declaring Enumeration Variables**

```cpp
Direction heading;   // heading is a variable of type Direction
```

An enumeration variable can only be assigned **enumerator values** defined for that type. Assigning any other value is
an error:

```cpp
heading = north;    // ✅ valid — north is an enumerator
heading = 2000;     // ❌ invalid — 2000 is not an enumerator
```

Some compilers issue an error for invalid assignments, others only a warning. For maximum portability, **treat assigning
a non-enum value as an error**.

### **Arithmetic Restrictions**

**Only the assignment operator is defined for enumerations** — arithmetic operations are not:

```cpp
heading = south;          // ✅ valid
++heading;                // ❌ invalid
heading = north + south;  // ❌ invalid — but tricky, read below
```

The last example fails for a subtle reason. The `+` operator is not defined for enumerators, but enumerators **are
converted to integers** in arithmetic expressions — so `north + south` becomes `0 + 1 = 1`, which is a valid `int`.
However, an `int` **cannot be assigned back** to a `Direction` variable — hence the error.

Enumerators **can be promoted to `int`**, but `int` is **not automatically converted** to an enumeration type:

```cpp
int code  = north;       // ✅ valid — Direction promoted to int
heading   = 1;           // ❌ invalid — int not converted to Direction
code      = 1 + south;   // ✅ valid — south converted to int, result is int
```

Even though `1` corresponds to `south`, assigning `1` directly to `heading` is a **type error**. Assigning `south` to
`heading` is fine because both are type `Direction`.

An `int` can be assigned to an enum **only with an explicit type cast**:

```cpp
heading = Direction(2);      // ✅ valid — typecast 2 to Direction (east)
heading = Direction(40003);  // ⚠️ undefined — value outside valid range
```

### **Setting Enumerator Values**

By default, enumerators are assigned integer values starting at `0`, incrementing by `1`. Values can be set explicitly:

```cpp
enum FilePermission { read = 4, write = 2, execute = 1 };
```

Only some enumerators need to be set explicitly — **uninitialized enumerators are one greater than their predecessor**:

```cpp
enum Status { pending, active = 100, suspended };
// pending = 0, active = 100, suspended = 101
```

**Multiple enumerators can share the same value:**

```cpp
enum Response { no = 0, false_val = 0, yes = 1, true_val = 1 };
```

In earlier versions of C++, only `int` values could be assigned to enumerators. That restriction has been removed —
`long` and `long long` values are now valid.

### **Value Ranges for Enumerations**

C++ expanded the list of valid values beyond just the named enumerators. Each enumeration has a **range**, and any
integer value within that range can be assigned via a type cast:

```cpp
enum Bits { one = 1, two = 2, four = 4, eight = 8 };
Bits flags;

flags = Bits(6);   // ✅ valid — 6 is within the range of Bits
```

**The range is calculated as follows:**

- **Upper limit** — take the largest enumerator value, find the smallest power of two greater than it, subtract one. For
  example, largest value `8` → next power of two is `16` → upper limit is `15`
- **Lower limit** — if the smallest enumerator is `0` or greater, the lower limit is `0`. If negative, apply the same
  power-of-two approach with a minus sign

The compiler uses this range to decide how much storage to allocate — it might use 1 byte for a small range and 4 bytes
for a range requiring `long` values.

### **Practical Use**

In practice, enumerations are used more often to **define related symbolic constants** than to create new types. If you
only need the constants and not a variable of the enumeration type, the type name can be omitted entirely:

```cpp
enum { max_connections = 100, timeout = 30, retry_limit = 5 };
```

> C++11 introduces **scoped enumerations** — a more powerful and safer form of `enum` that avoids name conflicts and
> adds stronger type checking.

## **Pointers and the Free Store**

Every program must track three properties when storing data:

- **Where the information is stored** — the memory address
- **What value is kept there** — the data
- **What kind of information is stored** — the type

So far, a simple variable declaration handles all three — the compiler assigns a name, allocates memory, and tracks the
location internally. **Pointers offer a second strategy** — instead of treating the value as the primary quantity and
the address as derived, pointers treat the **address as the named quantity** and the **value as derived**.

### **The Address Operator `&`**

Applying the **`&` operator** to any variable retrieves its memory address:

```cpp
int score = 100;
cout << score;    // prints: 100
cout << &score;   // prints: 0x0065fd40 (memory address in hex)
```

Memory addresses are typically displayed in **hexadecimal notation**. The difference between two adjacent variable
addresses reflects the size of their types — an `int` at address `0x0065fd40` and the next `int` would be at
`0x0065fd44`, a difference of 4 bytes.

### **Declaring and Using Pointers**

A **pointer** is a variable that stores a memory address. A pointer declaration must specify the **type of data it
points to** — because while all addresses look the same, the type tells the program how many bytes to read and how to
interpret them:

```cpp
int  score   = 100;
int* p_score = &score;   // p_score holds the address of score
```

- `p_score` — the **address** (the pointer itself)
- `*p_score` — the **value at that address** (dereferencing)

The **`*` operator** — called the **dereferencing operator** or **indirection operator** — retrieves the value at the
stored address. The same `*` symbol is used for multiplication; C++ determines which is meant from context.

```cpp
cout << p_score;    // prints address: 0x0065fd40
cout << *p_score;   // prints value:   100

*p_score = 200;     // changes score to 200 through the pointer
cout << score;      // prints: 200
```

`score` and `*p_score` are **two sides of the same coin** — completely equivalent. Changes through the pointer directly
affect the original variable.

**Two style conventions exist for declaring pointers** — both are valid, the compiler ignores spacing:

```cpp
int *ptr;    // C style — emphasizes *ptr is an int
int* ptr;    // C++ style — emphasizes int* is a type
```

> ⚠️ The `*` applies to the **variable name**, not the type. This declaration creates **one pointer and one regular int
**:
> ```cpp
> int* p1, p2;   // p1 is int*, p2 is just int
> ```
> Each pointer variable needs its own `*`.

**A pointer variable is never simply a pointer** — it is always a **pointer to a specific type**. `double* tax_ptr` and
`char* name` are pointers of two entirely different types. Although both `tax_ptr` and `name` are the same size (they
are both addresses), `*tax_ptr` is 8 bytes interpreted as a `double` and `*name` is 1 byte interpreted as a `char`.

### **Initializing Pointers**

When initializing a pointer, **the pointer itself is initialized, not the value it points to**:

```cpp
int age = 25;
int* pt = &age;   // pt is initialized to the address of age, not *pt
```

### **Pointer Danger**

> ⚠️ **Creating a pointer allocates memory for the address — it does NOT allocate memory for the data.** Using an
> uninitialized pointer is one of the most dangerous errors in C++:
>
> ```cpp
> int* p;       // p contains a garbage address
> *p = 42;      // writing to an unknown memory location — disaster
> ```
>
> `p` could point anywhere — into program code, operating system memory, or another variable. The resulting bugs are
> among the **hardest to trace** in existence.
>
> **Pointer Golden Rule: Always initialize a pointer to a definite and appropriate address before dereferencing it.**

### **Pointers and Numbers**

Pointers are **not integers**, even though addresses are stored as numbers. You cannot assign a numeric value directly
to a pointer without an explicit type cast:

```cpp
int* pt = 0xFF00AB00;          // ❌ type mismatch
int* pt = (int*) 0xFF00AB00;   // ✅ explicit cast required
```

C++ enforces strict type agreement here. Just because an address is stored as a number does not mean integers and
pointers are interchangeable.

### **Allocating Memory with `new`**

The true power of pointers emerges when **allocating memory at runtime**. Declaring a variable allocates memory at
**compile time** — the size is fixed before the program runs. The **`new` operator** allocates memory while the program
is running, returning the address of the newly allocated block:

```cpp
int* p = new int;       // allocates memory for one int, returns its address
*p = 42;                // store a value in the allocated memory
```

This memory has no variable name — **the pointer is the only way to access it**. Such a block of memory is called a *
*data object**.

```cpp
typeName* pointer_name = new typeName;
```

The type is specified twice — once to determine how many bytes to allocate, and once to declare the pointer type.

Memory allocated with `new` comes from a region called the **heap** (or **free store**). Memory for ordinary variables
comes from the **stack**. These are separate regions of memory.

> ⚠️ **Out of Memory:** If insufficient memory is available, `new` throws an exception in modern C++. Older
> implementations returned a null pointer (`0`). C++ guarantees a null pointer never points to valid data, and provides
> tools to detect and respond to allocation failures.

### **Freeing Memory with `delete`**

`new` and `delete` must always be **used in pairs**. `delete` returns allocated memory back to the free store so it can
be reused:

```cpp
int* p = new int;   // allocate
*p = 42;            // use
delete p;           // free — memory returned to pool
```

`delete` removes the memory the pointer points to — **it does not remove the pointer itself**. The pointer can be reused
to point to a new allocation.

**Rules for `delete`:**

- **Do not** use `delete` on memory not allocated with `new`
- **Do not** use `delete` on the same block twice — result is undefined
- **Do not** use `delete` on a pointer to a regular variable
- It **is** safe to `delete` a null pointer — nothing happens

Failing to `delete` allocated memory causes a **memory leak** — memory that has been allocated but can never be used or
recovered. If a memory leak grows large enough, it can bring the program to a halt.

```cpp
int* p = new int;
int* q = p;    // two pointers to same block

delete q;      // ✅ valid — deletes the block p originally allocated
delete p;      // ❌ not ok — same block freed twice, undefined behavior
```

### **Dynamic Arrays with `new`**

The most common use of `new` is allocating **arrays at runtime** — called **dynamic arrays**. A fixed array declared
normally uses **static binding** — its size is set at compile time regardless of what the program actually needs. A
dynamic array uses **dynamic binding** — its size is decided while the program runs:

```cpp
int* scores = new int[100];   // allocate array of 100 ints at runtime
```

`new` returns the address of the **first element**. The array is accessed using standard bracket notation — **a pointer
to the first element of an array can be used exactly like an array name**:

```cpp
scores[0] = 95;
scores[1] = 87;
cout << scores[2];
```

Freeing a dynamic array requires **`delete` with brackets** — without brackets, only the first element is freed:

```cpp
delete[] scores;   // ✅ frees the entire array
delete scores;     // ❌ undefined behavior — wrong form for arrays
```

**Rules for matching `new` and `delete`:**

- `new` → `delete`
- `new[]` → `delete[]`
- Never mix the two forms

**A fundamental difference** between a pointer and a true array name: **an array name cannot be changed** — it is fixed
at the start of the array. A pointer is a variable and **can be incremented or decremented**:

```cpp
int* p = new int[5];
p++;                  // ✅ now points to second element — valid for pointers
                      // ❌ would be illegal if p were a true array name
p--;                  // point back to first element before freeing
delete[] p;
```

> The program tracks how much memory was allocated so `delete[]` can free it correctly — but that information is **not
publicly accessible**. You cannot use `sizeof` to find the number of elements in a dynamically allocated array. It is
**your responsibility** to track the size.

## **Pointers, Arrays, and Pointer Arithmetic**

The **near equivalence of pointers and array names** stems from **pointer arithmetic** and how **C++ handles arrays
internally**. First check the arithmetic. Adding one to an **integer variable** increases its value by one, but adding
one to a **pointer variable** increases its value by the number of **bytes of the type to which it points**. Adding one
to a pointer to **double** adds **8** to the numeric value on systems with **8-byte double**, whereas adding one to a
**pointer-to-short** adds **two** to the pointer value if **short is 2 bytes**. The program below demonstrates this
point and also shows another important point: **C++ interprets the array name as an address**.

```cpp
// addpntrs.cpp -- pointer addition
#include <iostream>
int main()
{
    using namespace std;

    double wages[3] = {10000.0, 20000.0, 30000.0};
    short stacks[3] = {3, 2, 1};

    // Here are two ways to get the address of an array
    double * pw = wages;          // name of an array = address
    short * ps = &stacks[0];      // or use address operator with array element

    cout << "pw = " << pw << ", *pw = " << *pw << endl;
    pw = pw + 1;

    cout << "add 1 to the pw pointer:\n";
    cout << "pw = " << pw << ", *pw = " << *pw << "\n\n";

    cout << "ps = " << ps << ", *ps = " << *ps << endl;
    ps = ps + 1;

    cout << "add 1 to the ps pointer:\n";
    cout << "ps = " << ps << ", *ps = " << *ps << "\n\n";

    cout << "access two elements with array notation\n";
    cout << "stacks[0] = " << stacks[0]
         << ", stacks[1] = " << stacks[1] << endl;

    cout << "access two elements with pointer notation\n";
    cout << "*stacks = " << *stacks
         << ", *(stacks + 1) = " << *(stacks + 1) << endl;

    cout << sizeof(wages) << " = size of wages array\n";
    cout << sizeof(pw) << " = size of pw pointer\n";

    return 0;
}
```

### **How C++ Interprets Array Names**

In most contexts, **C++ interprets the name of an array as the address of its first element**. Thus, the following
statement makes **pw** a pointer to type **double** and then initializes **pw** to **wages**, which is the address of
the first element of the **wages array**.

```cpp
double * pw = wages;
```

For **wages**, as with any array, the following equality holds:

```
wages = &wages[0] = address of first element of array
```

To demonstrate this explicitly, the program uses the **address operator** in the expression:

```cpp
short * ps = &stacks[0];
```

This initializes the pointer **ps** to the first element of the **stacks** array.

### **Pointer Values vs Dereferenced Values**

The program inspects the values of **pw** and **pw**.

* **pw** represents an **address**
* **pw** represents the **value stored at that address**

Because **pw points to the first element**, the value of **pw** corresponds to the first element of the **wages**
array. When the program adds one to **pw**, the numeric value of the pointer increases by the **size of the type it
points to**. Since **pw points to double**, the address increases by **8 bytes** on systems where **double occupies 8
bytes**. As a result, **pw** becomes the address of the **second element** of the array, and **pw** now refers to the
value stored in that second element.

> **Rule:** Adding one to a **pointer variable** increases its value by the number of **bytes of the type to which it
points**.

The program performs similar operations with **ps**. Because **ps points to short**, and because **short is 2 bytes**,
adding one to **ps** increases its value by **2 bytes**. The pointer therefore moves to the **next element of the array
**.

### **Array Notation and Pointer Notation**

Consider the array expression:

```
stacks[1]
```

The **C++ compiler treats this expression exactly as if it were written as**:

```
*(stacks + 1)
```

The second expression means:

1. Calculate the **address of the second element** of the array.
2. **Dereference** that address to obtain the value stored there.

Operator precedence requires parentheses here. Without them, the expression would add **1 to *stacks** instead of adding
**1 to stacks**.

> **General rule**

```
arrayname[i]  becomes  *(arrayname + i)
```

If a **pointer** is used instead of an array name, the compiler performs the same conversion:

```
pointername[i]  becomes  *(pointername + i)
```

This explains why **array notation works with pointers as well as array names**.

# **Pointers vs Array Names**

In many respects **pointer names and array names can be used similarly**:

* Both can use **array bracket notation**
* Both can be used with the **dereferencing operator (*)**
* Both typically represent **addresses**

However, there are important differences.

### **Difference 1 — Pointer values can change**

```cpp
pointername = pointername + 1;   // valid
```

```cpp
arrayname = arrayname + 1;       // not allowed
```

An **array name is a constant address**, whereas a **pointer variable can change**.

### **Difference 2 — Behavior of sizeof**

Applying **sizeof** to an array name yields the **size of the entire array**, but applying **sizeof** to a pointer
yields the **size of the pointer itself**, even if that pointer points to the array.

Example from the program:

```
sizeof(wages)  -> size of the entire wages array
sizeof(pw)     -> size of the pw pointer
```

This is one situation where **C++ does not treat the array name as an address**.

# **The Address of an Array**

Taking the **address of an array** is another situation where the name of an array is **not interpreted simply as its
address**.

Example:

```cpp
short tell[10];

cout << tell << endl;    // displays &tell[0]
cout << &tell << endl;   // displays address of whole array
```

Numerically, these two addresses may appear identical, but **conceptually they represent different things**:

| Expression | Meaning                          |
|------------|----------------------------------|
| `tell`     | address of the **first element** |
| `&tell`    | address of the **entire array**  |

If **short is 2 bytes**, the array occupies **20 bytes**.

Therefore:

* `tell + 1` increases the address by **2 bytes**
* `&tell + 1` increases the address by **20 bytes**

This difference comes from their **types**.

| Expression | Type                                                |
|------------|-----------------------------------------------------|
| `tell`     | **pointer-to-short** (`short*`)                     |
| `&tell`    | **pointer-to-array-of-10-shorts** (`short (*)[10]`) |

# **Pointer to an Array**

A pointer to an array can be declared as follows:

```cpp
short (*pas)[20] = &tell;
```

This declaration means:

* **pas** is a **pointer to an array of 20 shorts**
* **pas points to the array tell**

Parentheses are required. Without them, the declaration would mean **an array of pointers** instead of **a pointer to an
array**.

Because **pas is set to &tell**, the expression **pas** is equivalent to **tell**, and therefore:

```
(*pas)[0]
```

refers to the **first element of the tell array**.

### **Summary of Pointer Concepts**

#### **Declaring Pointers**

To declare a pointer to a particular type, use:

```cpp
typeName * pointerName;
```

Examples:

```cpp
double * pn;   // pn can point to a double value
char * pc;     // pc can point to a char value
```

Here **pn** and **pc** are **pointers**, and **double** and **char** represent the types **pointer-to-double** and *
*pointer-to-char**.

#### **Assigning Values to Pointers**

A pointer should hold a **memory address**. Addresses can be obtained using the **address operator (&)** or returned by
the **new operator**.

Examples:

```cpp
double * pn;
double * pa;
char * pc;

double bubble = 3.2;

pn = &bubble;
pc = new char;
pa = new double[30];
```

* `pn` receives the **address of bubble**
* `pc` receives the **address of newly allocated char memory**
* `pa` receives the **address of the first element of a dynamically allocated array**

#### **Dereferencing Pointers**

Dereferencing means **accessing the value stored at the address held by a pointer**.

The **dereferencing operator** is:

```
*
```

Example:

```cpp
cout << *pn;
*pc = 'S';
```

Array notation can also dereference a pointer:

```
pn[0]  is equivalent to  *pn
```

> **Never dereference an uninitialized pointer.**

#### **Pointer vs Pointed-to Value**

If **pt** is a pointer-to-int, then:

* **pt** is the pointer
* **pt** is the **int value stored at that address**

Example:

```cpp
int * pt = new int;
*pt = 5;
```

Here:

* `pt` stores the **memory address**
* `*pt` stores the **value 5**

#### **Pointer Arithmetic**

C++ allows several arithmetic operations on pointers.

Supported operations include:

* **Adding an integer to a pointer**
* **Subtracting an integer from a pointer**
* **Finding the difference between two pointers**

Example:

```cpp
int tacos[10] = {5,2,8,4,1,2,2,4,6,8};
int * pt = tacos;

pt = pt + 1;

int * pe = &tacos[9];
pe = pe - 1;

int diff = pe - pt;
```

Rules:

* Adding an integer moves the pointer **forward by that many elements**
* Subtracting an integer moves the pointer **backward**
* Subtracting two pointers gives the **distance in elements**

> Pointer subtraction is meaningful **only when both pointers refer to the same array** (or one element past its end).

#### **Static vs Dynamic Arrays**

##### **Static Binding**

Array size determined **during compilation**.

```cpp
int tacos[10];
```

##### **Dynamic Binding**

Array created **during runtime** using `new`.

```cpp
int size;
cin >> size;

int * pz = new int[size];
```

Memory must later be released:

```cpp
delete [] pz;
```

#### **Array Notation and Pointer Notation**

Using **array brackets** is equivalent to **pointer dereferencing with arithmetic**.

Examples:

```
tacos[0]  means  *tacos
tacos[3]  means  *(tacos + 3)
```

This works for both **array names** and **pointer variables**.

Example code:

```cpp
int * pt = new int[10];

*pt = 5;
pt[0] = 6;
pt[9] = 44;

int coats[10];
*(coats + 4) = 12;
```

#### **Pointers and C-Style Strings**

The relationship between arrays and pointers also applies to **C-style strings**.

Example:

```cpp
char flower[10] = "rose";
cout << flower << "s are red\n";
```

The array name **flower** is interpreted as the **address of its first character**. The output stream prints characters
starting from that address until it encounters the **null character `\0`**, which marks the end of the string.

Quoted strings behave similarly.

```
"s are red\n"
```

is interpreted as the **address of the first character of the string literal**.

> With **cout** and most C++ expressions,
>
> * a **char array name**,
> * a **pointer-to-char**, and
> * a **quoted string constant**
    >   are all interpreted as **addresses of the first character of a string**.

#### **Important Safety Rule for Strings**

> When reading a string into a C-style string, the destination must be **previously allocated memory**.
> The address must come from **an array name** or **a pointer initialized with `new`**.

Using an **uninitialized pointer** for input can overwrite arbitrary memory and crash the program.

### **Memory Management in C++**

C++ manages memory in **three primary ways**.

| Storage Type          | Lifetime                         |
|-----------------------|----------------------------------|
| **Automatic storage** | Exists while a function executes |
| **Static storage**    | Exists for the entire program    |
| **Dynamic storage**   | Exists until explicitly freed    |

#### **Automatic Storage**

Variables declared inside functions use **automatic storage**.

Characteristics:

* Created when the function is called
* Destroyed when the function ends
* Usually stored on a **stack**

Stack allocation follows **Last-In, First-Out (LIFO)** behavior.

#### **Static Storage**

Static variables exist for the **entire duration of the program**.

Two ways to create them:

* Declare them **outside functions**
* Use the **static keyword**

Example:

```cpp
static double fee = 56.50;
```

#### **Dynamic Storage**

Dynamic memory is managed using **new** and **delete**.

Memory is allocated from the **free store (heap)**.

Example:

```cpp
int * p = new int;
```

Memory is released with:

```cpp
delete p;
```

Unlike automatic variables, **dynamic memory remains allocated until explicitly freed**.

### **Memory Leaks**

If memory allocated with **new** is never released with **delete**, the program creates a **memory leak**.

A **memory leak** occurs when:

* memory remains allocated
* the pointer to it is lost
* the program can no longer free it

Consequences include:

* reduced available memory
* degraded performance
* potential program crashes

> Best practice: always **pair `new` with `delete`**.

Modern C++ frequently uses **smart pointers** to automate memory management and reduce the risk of leaks.

### **Final Note on Pointers**

**Pointers are one of the most powerful features of C++**, but they are also among the most error-prone. Because
pointers allow direct manipulation of memory addresses, mistakes such as **using uninitialized pointers**, **accessing
invalid memory**, or **freeing memory incorrectly** can cause severe program failures.

Understanding pointers requires **careful study and repeated practice**, and the concepts appear repeatedly throughout
advanced C++ programming topics.

## Array Alternatives

### **Three Ways to Use Arrays in C++**

C++ offers three main approaches for storing sequences of elements:

1. **Built-in arrays** (`type arr[n]`)
2. **`std::vector`** (dynamic array)
3. **`std::array`** (fixed-size safer array)

All support **array indexing with `[]`**, but they differ in **memory management, safety, and flexibility**.

### **Built-in Arrays (C / original C++)**

Example:

```cpp
double a1[4] = {1.2, 2.4, 3.6, 4.8};
```

Characteristics:

* Size must be **known at compile time**
* Stored on the **stack**
* **Very fast**
* **No bounds checking**
* Cannot be assigned or copied directly

Example of illegal copy:

```cpp
double a2[4];
a2 = a1;   // ❌ not allowed
```

Must copy manually:

```cpp
for(int i = 0; i < 4; i++)
    a2[i] = a1[i];
```

# 3. `std::vector` (Dynamic Array)

Header required:

```cpp
#include <vector>
```

Example:

```cpp
vector<double> a2(4);
```

This creates a vector with **4 elements**.

Elements are assigned like arrays:

```cpp
a2[0] = 1.0/3.0;
a2[1] = 1.0/5.0;
a2[2] = 1.0/7.0;
a2[3] = 1.0/9.0;
```

Important characteristics:

* **Dynamic size**
* Stored on the **heap**
* Automatically manages memory (`new` and `delete`)
* Supports **resizing**
* Supports operations like `push_back()` and `insert()`

Example:

```cpp
vector<int> v;

v.push_back(10);
v.push_back(20);
```

Vector grows automatically.

# 4. `std::array` (C++11 Fixed Array)

Header required:

```cpp
#include <array>
```

Example:

```cpp
array<double, 4> a3 = {3.14, 2.72, 1.62, 1.41};
```

Syntax:

```
array<type, size>
```

Example:

```cpp
array<int, 5> numbers;
```

Characteristics:

* **Fixed size**
* Stored on the **stack** (like built-in arrays)
* Safer and more convenient
* Supports **assignment and copying**

Example:

```cpp
array<double,4> a4;
a4 = a3;    // valid
```

This copies the entire array.

### **Comparing Memory Locations**

Example output from the program:

```
a1[2]: 3.6 at 0x28cce8
a2[2]: 0.142857 at 0xca0328
a3[2]: 1.62 at 0x28ccc8
a4[2]: 1.62 at 0x28cca8
```

Observation:

| Type           | Memory Location   |
|----------------|-------------------|
| Built-in array | Stack             |
| `std::array`   | Stack             |
| `std::vector`  | Heap (free store) |

Vector elements live in **dynamic memory**.

### **Dangerous Behavior of Built-in Arrays**

This line appears in the example:

```cpp
a1[-2] = 20.2;
```

Equivalent to:

```
*(a1 - 2) = 20.2
```

Meaning:

1. Start at the address of `a1`
2. Move **two elements backward**
3. Write the value there

This writes **outside the array memory**.

C++ **does not check bounds**, so memory corruption occurs.

Example output:

```
a1[-2]: 20.2
a3[2]: 20.2
```

This means the program **accidentally overwrote data inside `a3`**.

This is called **undefined behavior**.

### **Safer Access with `at()`**

`vector` and `array` provide a safer method:

```cpp
a2.at(1) = 2.3;
```

Difference:

| Access Method | Behavior                 |
|---------------|--------------------------|
| `[]`          | No bounds checking       |
| `at()`        | Checks bounds at runtime |

If index is invalid:

```
program aborts (runtime error)
```

Example of invalid access:

```cpp
a2.at(200) = 5;   // runtime error
```

This prevents memory corruption.

### **Summary Comparison**

| Feature         | Built-in Array | `std::vector`     | `std::array`      |
|-----------------|----------------|-------------------|-------------------|
| Size            | Fixed          | Dynamic           | Fixed             |
| Memory          | Stack          | Heap              | Stack             |
| Bounds checking | No             | Optional (`at()`) | Optional (`at()`) |
| Assignment      | ❌ Not allowed  | ✔ Allowed         | ✔ Allowed         |
| Resize          | ❌              | ✔                 | ❌                 |
| Safety          | Low            | High              | Medium            |

### **When to Use Each**

**Use built-in arrays when:**

* Maximum performance is required
* Size known at compile time
* Low-level code

**Use `std::vector` when:**

* Size changes during runtime
* You need dynamic containers
* Most common choice in modern C++

**Use `std::array` when:**

* Size is fixed
* You want safer behavior than raw arrays
* No dynamic allocation needed

### **Key Rule (Modern C++ Practice)**

In modern C++:

* Prefer **`std::vector`**
* Use **`std::array`** for fixed-size containers
* Avoid **raw arrays** unless necessary (low-level code or legacy APIs).

## Summary

Arrays, structures, and pointers are three C++ compound types.An array can hold several values, all the same type, in
a single data object. By using an index, or subscript, you can access the individual elements in an array.

A structure can hold several values of different types in a single data object, and you can use the membership
operator (.) to access individual members.The first step in using structures is to create a structure template that
defines what members the structure holds. The name, or tag, for this template then becomes a new type identifier.You can
then declare structure variables of that type.

A union can hold a single value, but it can be of a variety of types, with the member
name indicating which mode is being used.

Pointers are variables that are designed to hold addresses.We say a pointer
points to the address it holds.The pointer declaration always states to what type of object a pointer points.Applying
the dereferencing operator (*) to a pointer yields the value at the location to which the pointer points.

A string is a series of characters terminated by a null character.A string can be represented by a quoted string
constant, in which case the null character is implicitly under-stood. You can store a string in an array of char, and
you can represent a string with a pointer-to-char that is initialized to point to the string.The strlen() function
returns the length of a string, not counting the null character.The strcpy() function copies a string from one location
to another.When using these functions, you include the cstring or the string.h header file.

The C++ string class, supported by the string header file, offers an alternative, more user-friendly means to deal with
strings. In particular, string objects are automatically resized to accommodate stored strings, and you can use the
assignment operator to copy a string.

The new operator lets you request memory for a data object while a program is running.The operator returns the
address of the memory it obtains, and you can assign that address to a pointer.The only means to access that memory is
to use the pointer. If the data object is a simple variable, you can use the dereferencing operator (*) to indicate a
value. If the data object is an array, you can use the pointer as if it were an array name to access the elements. If
the data object is a structure, you can use the pointer dereferencing operator (→) to access structure members.

Pointers and arrays are closely connected. If ar is an array name, then the expression ar[i] is interpreted as *(ar +
i), with the array name interpreted as the address of the first element of the array. Thus, the array name plays the
same role as a pointer. In turn, you can use a pointer name with array notation to access elements in an array allocated
by new.

The new and delete operators let you explicitly control when data objects are allocated and when they are
returned to the memory pool. Automatic variables, which are those declared within a function, and static variables,
which are defined outside a function or with the keyword static, are less flexible.An automatic variable comes into
being when the block containing it (typically a function definition) is entered, and it expires when the block is left.A
static variable persists for the duration of a program. The Standard Template Library (STL), added by the C++98
standard, provides a vector template class that provides an alternative to do-it-yourself dynamic arrays. C++11 provides
an array template class that offers an alternative to fixed-sized built-in arrays.