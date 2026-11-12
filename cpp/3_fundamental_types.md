# **Dealing with Data**

## **Simple Variables**

The essence of **object-oriented programming (OOP)** is designing and extending data types to match the information they
represent. In C++, both **built-in** and **user-defined types** store data, and **variables** are how programs give
symbolic names to that data. Declaring a variable specifies its **type**, which determines the kind of information it
holds, and assigns a **name** that represents the stored value.

The built-in C++ types come in two groups: **fundamental types** and **compound types**.

Programs typically need to store information. To store an item of information in a computer, the program must keep track
of three fundamental properties:

* **Where the information is stored** — the memory location
* **What kind of information is stored** — the type
* **What value is kept there** — the data itself

```cpp
int braincount;
braincount = 5;
```

These statements tell the program that it is storing an **integer** and that the name `braincount` represents the
integer's value, `5` in this case. The program locates a chunk of memory **large enough to hold an integer**, notes the
location, and copies the value `5` into it. You can use `braincount` later in your program to access that memory
location. You can use the **`&` operator** to retrieve `braincount`'s address in memory.

### **Naming Convention**

C++ encourages you to use **meaningful, descriptive names** for variables.

**Rules:**

* Names can contain **letters**, **digits**, and **underscores** (`_`)
* The **first character cannot be a digit**
* **Uppercase and lowercase letters are distinct** — `Score` and `score` are different variables
* You **cannot use a C++ keyword** as a name
* Names starting with **two underscores** or an **underscore followed by an uppercase letter** are **reserved for the
  implementation**
* Names starting with a **single underscore** are **reserved globally**
* **No strict length limit**, though some platforms may impose their own

**Multi-word naming conventions:**

* **snake\_case**: `player_score` — preferred by C veterans
* **camelCase**: `playerScore` — preferred by Pascal-influenced programmers

### **Integer Types**

Integers are numbers with **no fractional part**, such as `2`, `98`, `–5286`, or `0`. Because memory is finite, a
program cannot represent all integers, so C++ provides **multiple integer types** that differ in the amount of memory
they use. A **wider type** can store a **larger range of values**. **Signed types** can hold both positive and negative
values, while **unsigned types** cannot be negative — which **increases their maximum positive value**. The amount of
memory a type uses is called its **width**.

C++'s basic integer types, in order of **increasing width**, are `char`, `short`, `int`, `long`, and `long long`, each
available in **signed** or **unsigned** form. The `char` type has special properties because it is usually used to
represent **characters** rather than numeric values.

### **The `short`, `int`, `long`, and `long long` Integer Types**

Computer memory consists of **bits**, and the number of bits used determines an integer type's **width** and **value
range**. C++ provides several integer types with increasing width: `short`, `int`, `long`, and `long long`. Each type is
available in **signed** or **unsigned** form. **Signed integers** split their range roughly equally between positive and
negative values, while **unsigned integers** cannot be negative, extending the maximum positive value. **All standard
integer types are signed by default.**

**Minimum guaranteed widths of the standard types:**

| Type        | Minimum Width | Notes                         |
|-------------|---------------|-------------------------------|
| `short`     | **16 bits**   | —                             |
| `int`       | **≥ short**   | Most efficient for arithmetic |
| `long`      | **32 bits**   | At least as wide as `int`     |
| `long long` | **64 bits**   | At least as wide as `long`    |

**Declaration examples — signed and unsigned variants:**

```cpp
short s = -100;                           // signed short
unsigned short us = 500;                  // unsigned short

int i = 1000;                             // signed int
unsigned int ui = 3000;                   // unsigned int

long l = -100000L;                        // signed long
unsigned long ul = 100000UL;              // unsigned long

long long ll = -10000000000LL;            // signed long long
unsigned long long ull = 10000000000ULL;  // unsigned long long
```

> **Note:** `short` is shorthand for `short int`, and `long` is shorthand for `long int`. These longer forms are rarely
> used in practice.

Use the **`sizeof` operator** to determine how much memory a variable or type occupies in **bytes**. This is critical
because **different systems may use different memory layouts**, and knowing the size helps you write **portable,
architecture-independent code**.

```cpp
cout << "Size of short: "         << sizeof(s)   << " bytes\n";
cout << "Size of unsigned short: " << sizeof(us)  << " bytes\n";
cout << "Size of int: "            << sizeof(i)   << " bytes\n";
cout << "Size of unsigned int: "   << sizeof(ui)  << " bytes\n";
cout << "Size of long: "           << sizeof(l)   << " bytes\n";
cout << "Size of unsigned long: "  << sizeof(ul)  << " bytes\n";
cout << "Size of long long: "      << sizeof(ll)  << " bytes\n";
cout << "Size of unsigned long long: " << sizeof(ull) << " bytes\n";
```

### **Checking Limits**

C++ provides **symbolic constants** for each type in the **`<climits>`** header (or `<limits.h>` in older
implementations). These constants give the **maximum and minimum values** a type can hold, and **avoid hardcoding
numbers** that might change across different systems or architectures.

```cpp
#include <climits>

cout << "Maximum short: "              << SHRT_MAX  << "\n";
cout << "Minimum short: "              << SHRT_MIN  << "\n";
cout << "Maximum unsigned short: "     << USHRT_MAX << "\n";

cout << "Maximum int: "                << INT_MAX   << "\n";
cout << "Minimum int: "                << INT_MIN   << "\n";
cout << "Maximum unsigned int: "       << UINT_MAX  << "\n";

cout << "Maximum long: "               << LONG_MAX  << "\n";
cout << "Minimum long: "               << LONG_MIN  << "\n";
cout << "Maximum unsigned long: "      << ULONG_MAX << "\n";

cout << "Maximum long long: "          << LLONG_MAX  << "\n";
cout << "Minimum long long: "          << LLONG_MIN  << "\n";
cout << "Maximum unsigned long long: " << ULLONG_MAX << "\n";
```

### **Why This Matters**

1. **Portability** — Not all systems have the same type sizes. Using `sizeof` and limits constants ensures your code
   behaves correctly on **different architectures**.
2. **Prevent Overflow** — Using `INT_MAX` or `UINT_MAX` helps prevent calculations from **silently exceeding a type's
   range**.
3. **Memory Optimization** — Knowing type sizes helps you choose the **smallest type that safely holds your data**,
   which is crucial for **large arrays** or **memory-constrained systems**.
4. **Signed vs Unsigned Awareness** — The range differs significantly between signed and unsigned types. **`sizeof`
   alone tells you memory size**, but limits constants tell you the **actual numeric range**.

> **Tip:** Combine `sizeof` with limits constants for **robust, portable code**. For example, declare an array of
`short` only if `SHRT_MAX` is large enough to store all your expected values.

### **Bits and Bytes**

The **fundamental unit** of computer memory is the **bit**, which can hold exactly one of two states: **0 (off)** or
**1 (on)**. Multiple bits combine to represent larger values.

A **byte** is a group of bits — **usually 8** — that represents a value. It is the **smallest addressable unit of
memory** in most systems. A single byte can store **256 distinct values**, which is enough to represent all standard
ASCII characters. In C++, a byte is formally defined as **enough bits to hold the implementation's basic character
set**, which may be larger for Unicode or other extended sets. Some systems also refer to an 8-bit byte as an **octet**.

**Why 8 bits?** Eight bits strike a practical balance — **enough values (256) to encode standard characters**, without
wasting memory. Smaller chunks (e.g., 4 bits) are too limited; larger chunks waste space when storing small values.

**The number of possible values doubles with each additional bit:**

| Width       | Possible Values            |
|-------------|----------------------------|
| **8 bits**  | 256                        |
| **16 bits** | 65,536                     |
| **32 bits** | 4,294,967,296              |
| **64 bits** | 18,446,744,073,709,551,616 |

**Unsigned types** use the full range starting from `0`, while **signed types** split the range between **negative and
positive values**.

**A byte is also the standard unit of memory measurement:**

* **1 KB** = 1,024 bytes
* **1 MB** = 1,024 KB

### **Initialization**

**Initialization** combines **declaration** and **assignment** in a single step:

```cpp
int n_int = INT_MAX;  // declares and sets n_int to the largest possible int value
```

Variables defined inside functions **without initialization** have **indeterminate values** — they may contain
**leftover garbage data from memory**. Assigning a value at declaration prevents accidental use of that garbage:

```cpp
short year = 1492;  // safer than declaring and assigning separately
```

> **Tip:** **Always initialize variables** when you know their starting value. This avoids **unpredictable behavior**
> and makes your code **safer and easier to reason about**.

### **Signed and Unsigned Types**

All standard integer types (`short`, `int`, `long`, `long long`) are **signed by default**, meaning they can store
**both negative and positive values**. You can create **unsigned variants** using the **`unsigned` keyword**. Unsigned
types **cannot hold negative values**, but in exchange allow a **larger maximum positive value** for the same number of
bits.

**Declaration examples:**

```cpp
short s = -100;                             // signed short (default)
unsigned short us = 500;                    // unsigned short

int i = -1000;                              // signed int (default)
unsigned int ui = 3000;                     // unsigned int

long l = -100000L;                          // signed long (default)
unsigned long ul = 100000UL;                // unsigned long

long long ll = -10000000000LL;              // signed long long (default)
unsigned long long ull = 10000000000ULL;    // unsigned long long
```

#### **Key Differences**

* **Signed integers** split the range **roughly evenly** between negative and positive numbers.
    * Example: a 16-bit `short` ranges from **–32,768 to 32,767**
* **Unsigned integers** start at `0` and extend to a **higher positive maximum**.
    * Example: a 16-bit `unsigned short` ranges from **0 to 65,535**

#### **When to Use**

* Use **signed types** for values that **can be negative** — temperature, elevation, financial balances
* Use **unsigned types** for quantities that are **never negative** — counts, populations, array sizes, bit flags

#### **Caveats**

* **Overflow and underflow** — Signed integers may **wrap around silently** if the value exceeds the type's limits:

```cpp
int x = INT_MAX;
x = x + 1;   // x may silently wrap to INT_MIN on most systems
```

* **Unsigned integers** wrap from their maximum **back to 0** — also silently
* **Mixing signed and unsigned types** in arithmetic can cause **unexpected results**, because the signed value may be
  **implicitly converted to unsigned** before the operation

#### **Checking Size and Limits**

To ensure your variables can safely store expected values, always verify their **size** and **numeric range**:

```cpp
#include <climits>

cout << "signed short range: "   << SHRT_MIN << " to " << SHRT_MAX << "\n";
cout << "unsigned short range: 0 to " << USHRT_MAX << "\n";
```

### **Choosing an Integer Type**

**Natural size** refers to the integer type that the computer handles **most efficiently**. As a default, **use `int`**
unless there is a specific reason to choose otherwise.

**Guidelines for choosing the right type:**

| Type            | When to Use                                                                  |
|-----------------|------------------------------------------------------------------------------|
| **`char`**      | Only a **single byte** is needed; small values or characters                 |
| **`short`**     | **Conserving memory** in large arrays; smaller than `int` on some systems    |
| **`int`**       | **Default choice** for general integers; most efficient for arithmetic       |
| **`long`**      | Values that may **exceed `int` limits**; improves cross-platform portability |
| **`long long`** | **Extremely large integers** beyond the range of `long`                      |
| **`unsigned`**  | Quantities that are **never negative**; increases the maximum positive value |

> **Efficiency matters** when dealing with arrays or large data structures. **A bit saved is a bit earned.**

### **The `char` Type**

**`char` is an integer type.** It does not store the letter `'M'` directly — it stores the **numeric code** that
represents it. On most systems that means **ASCII**. The letter `'M'` has ASCII value `77`, so when you write:

```cpp
char ch = 'M';
```

The computer stores `77` in memory. What makes `char` feel different from `int` is that **`cin` and `cout` are
type-aware** — they automatically translate between the numeric code and the visible character. Assign `77` to an `int`
and `cout` prints `77`. Assign it to a `char` and `cout` prints `M`. The value in memory is **identical** — the type
drives the display behavior.

Because `char` is an integer, **arithmetic works directly on it**:

```cpp
char ch = 'M';   // stores 77
ch = ch + 1;     // now 78, which is 'N'
```

No conversion functions needed. This makes character manipulation clean and direct.

### **Signed vs Unsigned `char`**

Unlike `int`, **`char` is neither signed nor unsigned by default** — the implementation decides. This matters when you
use `char` as a numeric type rather than for characters:

- **`signed char`** — range –128 to 127
- **`unsigned char`** — range 0 to 255
- **`char`** — fine for standard characters like ASCII, but behavior with values above 127 is implementation-defined

```cpp
unsigned char uc = 200;   // safe on any system
signed char   sc = 200;   // may overflow — undefined behavior
char          c  = 200;   // may work or may not — depends on the platform
```

If you are using `char` to hold **character data**, the signed/unsigned distinction usually does not matter. If you are
using it as a **small integer**, always be explicit with `signed char` or `unsigned char`.

### **Character Literals and `cout.put()`**

Character literals use **single quotes**: `'M'`. This is **not the same** as the string `"M"` which uses double quotes.
Single quotes produce a single numeric value. Double quotes produce a string object — a fundamentally different thing in
C++.

The `cout.put()` member function outputs a single character explicitly:

```cpp
cout.put('M');   // prints: M
cout.put(ch);    // prints whatever character ch holds
```

This exists mostly for historical reasons. Before C++ Release 2.0, character constants like `'M'` were stored as `int`,
not `char`, so `cout << 'M'` would print `77` instead of `M`. `cout.put()` was the reliable workaround. Modern C++
stores character constants as `char`, so `cout << 'M'` works correctly — but `cout.put()` remains useful when you want
to be **explicit** about outputting a character.

### **Escape Sequences**

Some characters cannot be typed directly into source code — either because the keyboard has no key for them, or because
C++ assigns them special meaning. **Escape sequences** solve this:

| Sequence | Meaning                                 |
|----------|-----------------------------------------|
| `\n`     | Newline                                 |
| `\t`     | Horizontal tab                          |
| `\a`     | Alert (bell)                            |
| `\\`     | Literal backslash                       |
| `\"`     | Double quote inside a string            |
| `\'`     | Single quote inside a character literal |
| `\b`     | Backspace                               |

```cpp
cout << "Ben \"Buggsie\" Hacker\n";   // prints: Ben "Buggsie" Hacker
```

Escape sequences behave exactly like regular characters — wrap them in single quotes for a character constant, embed
them in strings without quotes.

You can also write escape sequences using **octal or hexadecimal codes** — for example `'\032'` or `'\x1a'` both
represent Ctrl+Z. However, **always prefer the symbolic form** (`\n`, `\t`, etc.) over numeric codes when one exists.
Symbolic sequences are portable across character encodings; numeric codes are tied to a specific encoding like ASCII.

### **Integer Constants (Literals)**

**C++ stores integer constants as `int` by default**, unless a suffix or the size of the value forces a different type.

#### **Number Bases**

C++ lets you write integer literals in three bases, identified by their prefix:

- **Decimal** — no prefix, first digit 1–9: `93`
- **Octal** — leading `0`: `042` equals 34 in decimal
- **Hexadecimal** — leading `0x` or `0X`: `0x42` equals 66 in decimal

All three bases store the **same binary value in memory** — the prefix is purely a notational convenience for the
programmer. Hexadecimal is particularly common when working with **memory addresses, hardware registers, and bit
masks**, because one hex digit maps exactly to four binary bits, making patterns far easier to read than either decimal
or octal.

#### **Type Suffixes**

When you write a numeric constant, C++ needs to know what type to store it as. Without a suffix, it picks the **smallest
type that fits the value**, starting from `int`. You can force a specific type using suffixes:

```cpp
22022L       // long
22022UL      // unsigned long
10000000000LL  // long long  (C++11)
10000000000ULL // unsigned long long  (C++11)
```

**Always use uppercase `L`** — lowercase `l` looks indistinguishable from the digit `1` in most fonts.

When no suffix is present, the rules differ slightly between decimal and hex/octal. A decimal constant without a suffix
fits into the smallest of `int`, `long`, or `long long`. A hex or octal constant without a suffix fits into the smallest
of `int`, `unsigned int`, `long`, `unsigned long`, `long long`, or `unsigned long long`. This is why `0x9C40` might be
stored as `unsigned int` on a 16-bit system even though its decimal equivalent `40000` would be stored as `long` — hex
is frequently used for memory addresses, which are inherently unsigned.

### **Controlling Output Format**

By default `cout` displays integers in decimal regardless of how they were written in source code. You can change this
with the `dec`, `hex`, and `oct` manipulators:

```cpp
cout << hex;   // all subsequent integers display in hexadecimal
cout << oct;   // all subsequent integers display in octal
cout << dec;   // back to decimal
```

The **format persists** until explicitly changed — it does not reset after a single value. `cout << hex` produces no
visible output itself; it just changes `cout`'s internal state.

### **Unicode and Wide Character Types**

Standard `char` holds 8 bits and 256 possible values — enough for ASCII and basic Latin characters, but **completely
insufficient for international text**. C++ has evolved its character types over time to address this.

#### **`wchar_t` — The First Attempt**

`wchar_t` (wide character type) was introduced to handle extended character sets like Japanese kanji. It is large enough
to represent the largest character set on the target system. You prefix wide character literals with `L`:

```cpp
wchar_t bob = L'P';
wcout << L"tall" << endl;
```

The problem with `wchar_t` is that **its size is implementation-defined**. It might be 16 bits on one platform and 32
bits on another. This makes it unreliable for portable Unicode handling. `cin` and `cout` do not handle `wchar_t` — you
must use `wcin` and `wcout` instead.

#### **`char16_t` and `char32_t` — The Modern Solution (C++11)**

C++11 introduced two new character types with **fixed, guaranteed sizes and signedness**:

- **`char16_t`** — unsigned, exactly 16 bits. Matches Unicode code points of the form `\uXXXX`. Prefix: `u`
- **`char32_t`** — unsigned, exactly 32 bits. Matches Unicode code points of the form `\UXXXXXXXX`. Prefix: `U`

```cpp
char16_t c1 = u'q';
char32_t c2 = U'\U0000222B';   // ∫ integral sign
```

These exist because `wchar_t`'s variable size created real portability problems. When you need to work with Unicode in
portable code, **prefer `char16_t` or `char32_t`** over `wchar_t`.

#### **Universal Character Names**

C++ provides a way to embed any Unicode character in source code regardless of what the keyboard or platform supports —
**universal character names**:

- **`\uXXXX`** — 4 hex digits, for code points up to U+FFFF
- **`\UXXXXXXXX`** — 8 hex digits, for the full Unicode range

```cpp
int k\u00F6rper;              // variable named: körper
cout << "g\u00E2teau\n";     // prints: gâteau
```

**Universal character names are labels, not encodings.** `\u00F6` means "the character whose Unicode code point is
U+00F6." The compiler maps that to whatever internal encoding the platform uses. Your source code stays portable — the
compiler handles the translation.

### **The `bool` Type**

**`bool` stores exactly two values: `true` or `false`.** It was added to C++ by the ANSI/ISO Standard, named after
mathematician **George Boole**, who formalized the laws of logic mathematically.

Before `bool` existed, C++ used integers for boolean logic — **nonzero means true, zero means false**. That convention
still holds, and `bool` integrates with it directly through implicit conversions in both directions.

**Any numeric or pointer value converts implicitly to `bool`:**

```cpp
bool start = -100;   // true  — any nonzero value
bool stop  = 0;      // false — zero only
```

**`bool` converts to `int` by promotion:**

```cpp
int ans     = true;    // 1
int promise = false;   // 0
```

This means `bool` participates naturally in arithmetic and comparisons without any explicit casting. `true` is always
`1` and `false` is always `0` when promoted to an integer type.

A typical declaration looks like this:

```cpp
bool is_ready = true;
```

One thing worth understanding: **`bool` did not change how C++ evaluates conditions** — it formalized it. Code like
`if (x)` or `while (running)` worked before `bool` existed because the integer convention was already in place. What
`bool` added is **semantic clarity** — a variable declared as `bool` communicates its intent explicitly, rather than
relying on the reader to infer that an `int` is being used as a flag.

## **The `const` Qualifier**

**`const` declares a variable whose value cannot change after initialization.** It is the correct way to define symbolic
constants in C++, replacing the older `#define` preprocessor approach.

```cpp
const int Months = 12;
```

`Months` can now be used anywhere `12` would appear. The compiler enforces immutability — any attempt to reassign it is
a compile-time error. This is fundamentally better than a magic number like `12` scattered across a codebase, because
the name communicates **intent**, and if the value ever needs to change, you change it in **one place only**.

**`const` must be initialized at declaration.** There is no way to set it later:

```cpp
const int Toes;    // undefined value
Toes = 10;         // compile error — too late
```

Once the declaration passes without a value, the constant is permanently unspecified and unmodifiable — entirely
useless.

### **`const` vs `#define`**

`#define` is a preprocessor directive — it performs a **text substitution** before the compiler even sees the code. It
has no type, no scope, and no respect for C++ rules. `const` is a proper language construct and is superior in every
way:

- **`const` has an explicit type** — the compiler can type-check it
- **`const` respects scope** — it can be limited to a function or file rather than polluting the entire program
- **`const` works with complex types** — arrays, structures, and other elaborate types can be `const`; `#define` cannot
  handle these meaningfully

> **If you are coming from C and reaching for `#define` to create a constant, use `const` instead — always.**

### **Naming Conventions**

There is no single universal convention for naming constants, but common ones include capitalizing the first letter (
`Months`), using all uppercase (`MONTHS`), or prefixing with `k` (`kMonths`). The goal in all cases is the same — **make
constants visually distinct from variables** when reading code. Many organizations enforce a specific convention; follow
whatever your codebase or team uses consistently.

## **Floating-Point Numbers**

Integers cannot represent fractional values and cap out at a fixed maximum. **Floating-point types solve both 
problems** — they handle fractional values and can represent an enormous range of magnitudes, 
from the mass of an electron (`9.11e-31 kg`) to the mass of the Earth (`5.98E24 kg`).

### **How Floating-Point Works Internally**

A floating-point number is stored in two parts: a **base value (mantissa)** and a **scaling factor (exponent)**. The
scaling factor moves the decimal point left or right — hence the name *floating*-point. C++ uses binary internally so
the scaling is by powers of 2, but you never deal with that directly.

Every modern system represents floating-point numbers using **IEEE 754**. A 32-bit `float` is physically stored as three
fields in memory:

- **1 bit** — sign (positive or negative)
- **8 bits** — exponent (the scaling factor)
- **23 bits** — mantissa (the significant digits)

A 64-bit `double` gets **11 bits** for the exponent and **52 bits** for the mantissa — which is why it has roughly twice
the significant digits. The consequence of this structure is that **floating-point numbers are not evenly distributed on
the number line**. There are as many representable floats between 0 and 1 as there are between 1 and infinity. Numbers
close to zero are extremely dense; very large numbers have huge gaps between them. That is exactly why adding `1` to
`2.34E+22` did nothing — `1` fell into a gap.

### **Writing Floating-Point Numbers**

Two notations are valid. **Decimal notation** is straightforward:

```cpp
12.34
0.00023
8.0      // the decimal point makes this float, not int
```

**E notation** is used for very large or very small values:

```cpp
3.45E6      // 3.45 × 10⁶ = 3,450,000
8.33E-4     // 8.33 / 10⁴ = 0.000833
7E5         // same as 7.0E+05
```

`d.dddE+n` means move the decimal point `n` places **right**. `d.dddE-n` means move it `n` places **left**. You can use
`e` or `E` interchangeably, and the `+` sign on the exponent is optional. **No spaces are allowed** inside the number —
`7.2 E6` is invalid.

### **The Three Floating-Point Types**

C++ provides three types with increasing precision and range:

| Type          | Typical Size | Significant Digits | Exponent Range |
|---------------|--------------|--------------------|----------------|
| `float`       | 32 bits      | ~6–7               | ±37            |
| `double`      | 64 bits      | ~15                | ±307           |
| `long double` | 80–128 bits  | ~18                | ±4931          |

**`double` is the default** for floating-point literals and the right choice for most calculations. `float` saves memory
but sacrifices precision. `long double` is rarely needed outside scientific computing. Check your system's exact limits
in **`<cfloat>`**:

```cpp
#include <cfloat>
// FLT_DIG   ~6   significant digits for float
// DBL_DIG   ~15  significant digits for double
// LDBL_DIG  ~18  significant digits for long double
```

Floating-point literals are `double` by default. Use suffixes to force a specific type:

```cpp
1.234f        // float
2.45E20F      // float
2.345324E28   // double (default)
2.2L          // long double
```

**Always use uppercase `L`** for `long double` — lowercase `l` is indistinguishable from `1`.

### **Special Values**

IEEE 754 defines special values you will encounter in real code:

- **`Infinity`** — produced by dividing a nonzero number by zero (`1.0 / 0.0`). Not a crash — a valid representable
  state
- **`-Infinity`** — same, with a negative numerator
- **`NaN` (Not a Number)** — produced by undefined operations like `0.0 / 0.0` or `sqrt(-1)`. **NaN is infectious** —
  any arithmetic involving NaN produces NaN. It also never equals anything, including itself:

```cpp
double x = 0.0 / 0.0;   // NaN
x == x;                  // false — the only value not equal to itself
```

Use `std::isnan(x)` from `<cmath>` to check for NaN reliably.

### **Precision Loss — The Critical Caveat**

Floating-point precision is **finite and fixed**. `float` stores roughly 6–7 significant digits. Everything beyond that
is lost:

```cpp
float a = 2.34E+22f;
float b = a + 1.0f;
cout << b - a;   // prints 0, not 1
```

Adding `1` to a 23-digit number requires precision at the 23rd digit. `float` only tracks the first 6–7, so **the
addition has no effect whatsoever**. This is not a compiler bug — it is the fundamental nature of floating-point
representation.

### **Never Compare Floats for Equality**

Because of rounding and precision loss, two values that should mathematically be equal often are not:

```cpp
double a = 0.1 + 0.2;
a == 0.3;   // false
```

`0.1` and `0.2` have no exact binary representation — they are stored as the closest approximation, and those
approximations accumulate. Always compare within an **epsilon**:

```cpp
#include <cmath>
bool nearly_equal(double a, double b, double epsilon = 1e-9) {
    return std::abs(a - b) < epsilon;
}
```

Choosing the right epsilon depends on your domain — financial calculations need a different tolerance than physics
simulations.

### **Accumulation of Errors**

A single floating-point operation introduces a tiny rounding error. Perform millions of operations — as happens in
loops, simulations, and numerical algorithms — and those errors **accumulate**. 
This is called **numerical instability**. Even the order of operations matters — summing a large array from smallest to largest gives a more accurate result
than iterating in arbitrary order. If you are doing heavy numerical computation, research the **stability** of your
algorithm, not just its correctness on paper.

### **Floating-Point is Not Suitable for Money**

**Never use `float` or `double` to represent currency.** Rounding errors in binary floating-point do not align with
decimal rounding rules:

```cpp
double price = 0.1 + 0.2;   // 0.30000000000000004
```

For financial calculations, use **integer arithmetic in the smallest unit** — store cents as `int`, not dollars as
`double` — or use a dedicated decimal arithmetic library.

### **Trade-offs vs Integers**

Floating-point arithmetic is **slower than integer arithmetic** on most hardware. Floating-point types can represent a
far greater range of values and handle fractions, but at the cost of precision loss and performance. Use integers
whenever the data is naturally whole numbers — reserve floating-point for values that genuinely require it.

In performance-critical code like graphics, physics engines, or signal processing:

- **`float` is often faster than `double`** because SIMD units can pack twice as many 32-bit floats as 64-bit doubles
  into a single operation
- **Denormalized numbers** — extremely small values close to zero — can cause severe performance drops. Some systems
  take **100x longer** to process them. This is called a **denormal penalty** and is a real concern in audio and signal
  processing code

### **Practical Rules**

- **Use `double` by default** for any floating-point work
- **Use `float` only** when memory or SIMD performance genuinely matters
- **Never use floating-point for money** — use integer cents or a decimal library
- **Never compare floats with `==`** — always use an epsilon comparison
- **Watch for NaN propagation** — one bad operation silently corrupts every calculation downstream
- **Be aware of numerical instability** in long-running loops and accumulated arithmetic

## **C++ Arithmetic Operators**

C++ provides five basic arithmetic operators, each taking two operands to produce a result:

| Operator | Operation           | Example    | Result |
|----------|---------------------|------------|--------|
| `+`      | Addition            | `4 + 20`   | `24`   |
| `-`      | Subtraction         | `12 - 3`   | `9`    |
| `*`      | Multiplication      | `28 * 4`   | `112`  |
| `/`      | Division            | `1000 / 5` | `200`  |
| `%`      | Modulus (remainder) | `19 % 6`   | `1`    |

### **Division Behavior Depends on Operand Types**

The `/` operator behaves differently depending on what you divide. **If both operands are integers, the fractional part
is discarded entirely** — no rounding, just truncation:

```cpp
9 / 5       // 1  — fractional part dropped
9.0 / 5.0   // 1.8 — floating-point result
9.0 / 5     // 1.8 — one float operand is enough
```

This is called **integer division,** and it is not a bug — it is intentional and useful. When you need the remainder of
that integer division, that is exactly what `%` gives you.

### **The Modulus Operator**

`%` returns the **remainder** of an integer division. Both operands **must be integers** — using `%` with floating-point
values is a compile-time error.

```cpp
19 % 6    // 1  — because 6 goes into 19 three times, remainder 1
181 % 14  // 13 — useful for unit conversions
```

A practical use: converting a flat quantity into compound units. Converting pounds to stone and pounds:

```cpp
int stone  = lbs / 14;   // how many whole units
int pounds = lbs % 14;   // what's left over
```

This pattern — **integer division for the whole part, modulus for the remainder** — applies anywhere you decompose a
value into units: minutes and seconds, hours and minutes, dollars and cents.

When one operand is negative, the sign of the result follows this rule: `(a/b)*b + a%b == a` always holds.

### Caution with Division

**Integer Division (truncation)** — `7 / 2 = 3`, fractional part silently dropped.

**Division by Zero** — two different behaviors depending on type. With integers, it is **undefined behavior** — the
program may crash, produce garbage, or do something entirely unpredictable. With floating-point it produces `Infinity`
or `NaN` per IEEE 754 — no crash, but silently corrupted results propagating through calculations.

**Floating-Point Precision Loss** — division tends to produce long fractional results that cannot be represented exactly
in binary, making precision loss worse than with other operators.

**Mixed Type Division** — when one operand is `int` and the other is `double`, C++ silently promotes the `int` to
`double` before dividing. The result is floating-point. This is usually what you want, but it can surprise you when you
do not expect the promotion to happen.

**Overflow Before Division** — if you multiply two large numbers as part of a division expression, the intermediate
multiplication can overflow before the division ever happens. For example `(a * b) / c` can overflow even if the final
result would fit in the type. The fix is to reorder: `a / c * b` or cast to a wider type first.

**Modulus with Negatives** — `%` in C++ follows the rule that `(a/b)*b + a%b == a`. This means the sign of the remainder
follows the **dividend** (left operand), not the divisor. `-7 % 3 = -1` in C++, whereas some other languages return `2`.
This trips up programmers coming from Python where modulus always returns a non-negative result.

The ones that cause the most real-world bugs in order: **integer division truncation**, **division by zero** with
integers (undefined behavior), and overflow before division.

### **Operator Precedence and Associativity**

When an expression contains multiple operators, C++ applies **precedence rules** to determine evaluation order — the
same rules as standard algebra:

- `*`, `/`, and `%` are evaluated **before** `+` and `-`
- When operators share the same precedence, **left-to-right associativity** applies

```cpp
3 + 4 * 5       // 23 — multiplication first: 3 + (4 * 5)
120 / 4 * 5     // 150 — left to right: (120 / 4) * 5, not 120 / (4 * 5)
```

Precedence and associativity only matter **when two operators share the same operand**. In an expression like
`20 * 5 + 24 * 6`, the two `*` operators do not share an operand, so the compiler is free to evaluate them in whichever
order is most efficient — both give the same result here regardless.

**Use parentheses to enforce your intended order explicitly** whenever there is any ambiguity:

```cpp
(3 + 4) * 5     // 35 — parentheses override precedence
```

### **Operator Overloading**

The `/` operator is actually **three different operations** depending on context — integer division, float division, and
double division. C++ determines which to use based on the types of the operands. Using the same symbol for multiple
operations depending on type is called **operator overloading**. It is built into C++ for arithmetic types, and C++ also
lets you define it for your own classes — a foundational concept in OOP.

## Summary

C++’s basic types fall into two groups. One group consists of values that are stored as integers. The second group
consists of values that are stored in floating-point format. The integer types differ from each other in the amount of
memory used to store values and in whether they are signed or unsigned. From smallest to largest, the integer types are
bool, char, signed char, unsigned char, short, unsigned short, int, unsigned int, long, unsigned long, and, with C++11,
long long, and unsigned long long. There is also a wchar_t type whose placement in this sequence of size depends on the
implementation. C++11 adds the char16_t and char32_t types, which are wide enough to hold 16-bit and 32-bit character
codes, respectively. C++ guarantees that char is large enough to hold any member of the system’s basic character set,
wchar_t can hold any member of the system’s extended character set, short is at least 16 bits, int is at least as big as
short, and long is at least 32 bits and at least as large as int. The exact sizes depend on the implementation.

Characters are represented by their numeric codes.The I/O system determines whether a code is interpreted as a character
or as a number.

The floating-point types can represent fractional values and values much larger than integers can represent. The three
floating-point types are float, double, and long double. C++ guarantees that float is no larger
than double and that double is no larger than long double.Typically, float uses 32 bits of memory, double uses 64 bits,
and long double uses 80 to 128 bits.

By providing a variety of types in different sizes and in both signed and unsigned
varieties,

C++ lets you match the type to particular data requirements. C++ uses operators to provide the usual
arithmetical support for numeric types: addition, subtraction, multiplication, division, and taking the modulus.When
two operators seek to operate on the same value, C++’s precedence and associativity rules determine which operation
takes place first.

C++ converts values from one type to another when you assign values to a variable, mix types in
arithmetic, and use type casts to force type conversions. Many type conversions are “safe,” meaning you can make them
with no loss or alteration of data. For example, you can convert an int value to a long value with no problems.
Others, such as conversions of floating-point types to integer types, require more care. At first, you might find the
large number of basic C++ types a little excessive, particularly when you take into account the various conversion
rules. But most likely you will eventually find occasions when one of the types is just what you need at the time, and
you’ll thank C++ for having it.
