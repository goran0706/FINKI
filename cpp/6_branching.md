# Branching Statements and Logical Operators

## The `if` Statement

The `if` statement directs a program to execute a statement or block if a test condition is true, and skip it if false:

```cpp
if (test-condition)
    statement
```

The test condition is type-cast to `bool` — zero becomes `false`, nonzero becomes `true`. The entire `if` construction
counts as a single statement syntactically.

```cpp
cin.get(ch);
while (ch != '.')
{
    if (ch == ' ')
        ++spaces;
    ++total;       // executes every cycle regardless
    cin.get(ch);
}
```

## The `if else` Statement

`if else` chooses between two statements or blocks:

```cpp
if (test-condition)
    statement1
else
    statement2
```

Unlike BASIC or FORTRAN, C++ does not automatically treat everything between `if` and `else` as a block. Braces are
mandatory when multiple statements belong to a branch:

```cpp
// ❌ compiler sees a simple if ending at zorro++, then an orphaned else
if (ch == 'Z')
    zorro++;
    cout << "Another Zorro candidate\n";
else
    dull++;

// ✅ braces define the block explicitly
if (ch == 'Z')
{
    zorro++;
    cout << "Another Zorro candidate\n";
}
else
{
    dull++;
    cout << "Not a Zorro candidate\n";
}
```

### `if else if else` Chain

Because an `if else` is itself a single statement, it can follow an `else`, forming a chain of alternatives:

```cpp
if (ch == 'A')
    a_grade++;
else if (ch == 'B')
    b_grade++;
else if (ch == 'C')
    c_grade++;
else
    other++;
```

This is not a new construct — it is one `if else` nested inside another. The formatting just makes the branching
structure readable. The entire chain counts as one statement.

> **Tip — Bug Prevention:** Reverse the operands in equality checks to make accidental assignment a compile error.
`if (3 == myNumber)` causes a compiler error if mistyped as `if (3 = myNumber)`. `if (myNumber = 3)` silently assigns
`3` and always evaluates as `true` — the compiler may warn, but it compiles. Writing the constant on the left turns an
> elusive runtime bug into an immediate compile error.

## Logical Operators

### `||` — Logical OR

Combines two expressions into one. The result is `true` if **either or both** operands are true:

```cpp
x < 0 || x > 100   // true if x is outside the range 0–100
ch == 'y' || ch == 'Y'
```

`||` is a **sequence point** — the left side is fully evaluated and all side effects applied before the right side is
evaluated. C++ uses **short-circuit evaluation**: if the left operand is `true`, the right operand is never evaluated
because the result is already determined.

### `&&` — Logical AND

The result is `true` only if **both** operands are true:

```cpp
x >= 0 && x <= 100   // true if x is within range
i < ArSize && cin >> arr[i]
```

Like `||`, `&&` is a **sequence point** and uses short-circuit evaluation — if the left side is `false`, the right side
is skipped entirely. This is not just an optimization; it is guaranteed behavior you can rely on:

```cpp
// safe — division by zero never attempted if x == 0
x != 0 && 1.0 / x > 100.0
```

### Setting Up Ranges with `&&`

Each part of a range test must use two complete relational expressions joined by `&&`:

```cpp
// ✅ correct range test
if (age > 17 && age < 35)

// ❌ looks mathematical but is always true in C++
if (17 < age < 35)
```

The second form is always `true` because `17 < age` evaluates to `0` or `1`, and both `0 < 35` and `1 < 35` are always
true. The compiler won't catch this — it's valid syntax with wrong semantics.

When building a chain of ranges, ensure there are no gaps and no overlaps between them. Use `>=` at the lower bound of
each subsequent range to include the boundary value:

```cpp
if (age > 17 && age < 35)       index = 0;  // 18–34
else if (age >= 35 && age < 50) index = 1;  // 35–49
else if (age >= 50 && age < 65) index = 2;  // 50–64
else                             index = 3;  // 65+
```

### `!` — Logical NOT

Reverses the truth value of the expression that follows it:

```cpp
!cin.fail()        // true if input has not failed
!strcmp(s1, s2)    // true if strings are equal — idiomatic C/C++
while (!is_int(num))
```

`!` has **higher precedence** than relational and arithmetic operators — to negate a compound expression, enclose it in
parentheses:

```cpp
!(x > 5)    // is it false that x is greater than 5?
!x > 5      // ❌ always false — !x is 0 or 1, never > 5
```

### Operator Precedence

| Precedence | Operators |
|------------|-----------|
| Highest    | `!`       |
| Middle     | `&&`      |
| Lowest     | `\|\|`    |

Both `&&` and `||` have lower precedence than relational operators, so parentheses are rarely needed for simple
comparisons. For compound expressions mixing `&&` and `||`, always use parentheses to make intent explicit regardless of
whether they're technically required — it prevents misreading and reduces bugs:

```cpp
// without parentheses — && binds tighter, may not match intent
age > 30 && age < 45 || weight > 300

// explicit — unambiguous
(age > 30 && age < 45) || weight > 300
(age > 50 || weight > 300) && donation > 1000
```

### Alternative Representations

For keyboards or environments where `&&`, `||`, and `!` are unavailable:

| Operator | Alternative |
|----------|-------------|
| `&&`     | `and`       |
| `\|\|`   | `or`        |
| `!`      | `not`       |

These are C++ reserved words, not keywords — no header file required. In C, they require `<iso646.h>`.

## The `cctype` Character Functions

`<cctype>` provides character classification functions that are cleaner and more portable than hand-rolling comparisons
with relational operators:

```cpp
// ❌ manual — assumes ASCII ordering, fragile on non-ASCII systems
if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))

// ✅ portable, readable
if (isalpha(ch))
```

| Function       | Returns `true` if argument is...                                             |
|----------------|------------------------------------------------------------------------------|
| `isalnum(ch)`  | Alphanumeric (letter or digit)                                               |
| `isalpha(ch)`  | Alphabetic letter                                                            |
| `isblank(ch)`  | Space or horizontal tab                                                      |
| `iscntrl(ch)`  | Control character                                                            |
| `isdigit(ch)`  | Decimal digit `0`–`9`                                                        |
| `isgraph(ch)`  | Any printable character except space                                         |
| `islower(ch)`  | Lowercase letter                                                             |
| `isprint(ch)`  | Any printable character including space                                      |
| `ispunct(ch)`  | Punctuation character                                                        |
| `isspace(ch)`  | Whitespace (space, tab, newline, formfeed, carriage return, vertical tab)    |
| `isupper(ch)`  | Uppercase letter                                                             |
| `isxdigit(ch)` | Hexadecimal digit (`0`–`9`, `a`–`f`, `A`–`F`)                                |
| `tolower(ch)`  | Returns lowercase version if uppercase, otherwise returns argument unchanged |
| `toupper(ch)`  | Returns uppercase version if lowercase, otherwise returns argument unchanged |

Return type is `int`, not `bool` — but standard `bool` conversion applies in conditions.

## The Conditional Operator `?:`

The only C++ operator that takes **three operands**:

```cpp
expression1 ? expression2 : expression3
```

If `expression1` is true, the result is `expression2`. Otherwise, it is `expression3`. Unlike `if else`, the conditional
operator produces a **value** — it is an expression, not a statement, so it can be used inline:

```cpp
int c = a > b ? a : b;     // assigns the larger value directly
cout << (x > 0 ? "positive" : "non-positive");
```

Equivalent `if else`:

```cpp
int c;
if (a > b) c = a;
else       c = b;
```

The conditional operator is well suited for simple, single-value choices. When logic grows complex, `if else` is
clearer. Nesting conditional operators is syntactically valid but produces unreadable code and should be avoided.

## The `switch` Statement

`switch` routes execution to a labeled line based on the value of an integer expression:

```cpp
switch (integer-expression)
{
    case label1 : statement(s)
    case label2 : statement(s)
    default     : statement(s)
}
```

`integer-expression` must reduce to an integer type — `int`, `char`, or an enumerator. Floating-point values and ranges
are not supported. Each `case` label must be an **integer constant expression** — not a variable, not a range.

### Fall-Through Behavior

Each `case` label is a **line label only**, not a boundary. Without `break`, execution continues through all subsequent
cases regardless of their labels:

```cpp
switch (choice)
{
    case 1: report();  break;
    case 2: alarm();   break;
    default: cout << "Invalid\n";
}
```

Fall-through is not a bug — it is a deliberate feature used to map multiple labels to one action:

```cpp
case 'a':
case 'A': handle_a(); break;   // both lowercase and uppercase trigger the same code
case 'r':
case 'R': handle_r(); break;
```

> **Caution:** Forgetting `break` is one of the most common `switch` bugs. If `case 2` has no `break`, execution runs
> straight into `case 3`, `case 4`, and `default`. Some compilers warn about implicit fall-through; treat that warning
> as
> an error unless fall-through is intentional.

### Enumerators as Labels

`cin` cannot read enumerated types directly — read as `int` and let the compiler promote enumerators to `int` for
comparison:

```cpp
enum Color { red, orange, yellow, green, blue };
int code;
cin >> code;
switch (code)
{
    case red:    cout << "Red\n";    break;
    case orange: cout << "Orange\n"; break;
}
```

### `switch` vs `if else`

| Criterion               | `switch`                         | `if else`                |
|-------------------------|----------------------------------|--------------------------|
| Value type              | Integer/char/enum constants only | Any type, any expression |
| Ranges                  | ❌ Not supported                  | ✅ Supported              |
| Floating-point          | ❌ Not supported                  | ✅ Supported              |
| Variable comparison     | ❌ Not supported                  | ✅ Supported              |
| 3+ integer alternatives | ✅ More efficient, cleaner        | Works but verbose        |

> **Tip:** If you can use either, prefer `switch` for three or more integer or character alternatives — it is typically
> more efficient in both code size and execution speed, and the intent is immediately readable.

## `break` and `continue`

**`break`** exits the nearest enclosing loop or `switch` immediately, transferring execution to the statement that
follows it.

**`continue`** skips the remainder of the current loop body and begins the next iteration. In a `for` loop, the update
expression still executes. In a `while` loop, execution jumps directly to the condition — any update logic below
`continue` in the body is bypassed:

```cpp
// break — exits loop at first period
for (int i = 0; line[i] != '\0'; i++)
{
    cout << line[i];
    if (line[i] == '.') break;
}

// continue — skips non-spaces, counts only spaces
for (int i = 0; line[i] != '\0'; i++)
{
    if (line[i] != ' ') continue;
    spaces++;
}
```

`continue` can improve readability by eliminating deep nesting — instead of wrapping the entire loop body in an `if`,
you bail out early and keep the main logic at the top level.

> **Caution:** C++ also has `goto`. It is universally considered bad practice. Structured control flow — `if else`,
`switch`, `continue`, `break` — handles every case `goto` can, and does so readably. Never use `goto`.

## Number-Reading Loops

When `cin` fails to read a value — because the input doesn't match the expected type — four things happen:

- The target variable is left unchanged
- The mismatched input remains in the input queue
- An error flag is set on the `cin` object
- `cin`, converted to `bool`, returns `false`

The `false` return value lets you terminate a loop on invalid input. The error flag must be explicitly cleared with
`cin.clear()` before further input can be read. The bad input still sitting in the queue must also be discarded:

```cpp
// terminate loop when input fails
while (i < Max && cin >> arr[i])
{
    ++i;
}
```

```cpp
// reject bad input and retry
for (i = 0; i < Max; i++)
{
    cout << "Enter value: ";
    while (!(cin >> arr[i]))
    {
        cin.clear();                      // 1. reset error flag
        while (cin.get() != '\n')         // 2. discard remainder of bad input line
            continue;
        cout << "Please enter a number: "; // 3. prompt again
    }
}
```

The three recovery steps must happen in this order — clearing before discarding, discarding before re-prompting. If you
skip `cin.clear()`, the stream remains in a failed state and all subsequent reads silently do nothing.

> **Tip:** `cin >> value` used directly as a loop condition is idiomatic and reliable — `cin` converts to `true` on
> successful read and `false` on failure or EOF. This is more general than testing `!cin.fail()` because it also catches
> other failure states like disk errors. Short-circuit evaluation guarantees the array bounds are checked before
> attempting a read: `while (i < Max && cin >> arr[i])` will never read past the end of the array.

# Simple File I/O

## Text I/O Model

All `cin` input begins as text — raw bytes interpreted as character codes. The `cin` object translates that text into
the destination type. Given the input `38.5 19.2`:

| Destination type          | What `cin` reads                                                | What's left in queue            |
|---------------------------|-----------------------------------------------------------------|---------------------------------|
| `char`                    | `'3'` — single character code, no translation                   | `'8'` is next                   |
| `int`                     | `'3'`, `'8'` → numeric value `38`                               | `'.'` is next                   |
| `double`                  | `'3'`, `'8'`, `'.'`, `'5'` → numeric value `38.5`               | `' '` is next                   |
| `char[]` with `>>`        | `'3'`, `'8'`, `'.'`, `'5'` → stored as characters + `'\0'`      | `' '` is next                   |
| `char[]` with `getline()` | entire line through `'\n'` → stored + `'\0'`, newline discarded | first char of next line is next |

On output, the reverse happens — integers and floats are converted to character sequences. Character data requires no
translation in either direction. This means file I/O is inherently **text-based** when using these stream mechanisms —
binary databases and formatted word processor files are a different matter entirely.

## Writing to a Text File

File output mirrors `cout` exactly. Where `cout` uses `ostream`, file output uses `ofstream` from `<fstream>`:

```cpp
#include <fstream>

ofstream outFile;
outFile.open("carinfo.txt");  // creates file if it doesn't exist

double wt = 125.8;
outFile << wt;                // identical syntax to cout
outFile << fixed;
outFile.precision(2);         // formatting methods work identically
outFile.setf(ios_base::showpoint);
outFile << "Result: " << wt << endl;

outFile.close();
```

The four steps:

1. Include `<fstream>`
2. Declare an `ofstream` object
3. Associate it with a file via `open()` — takes a C-style string, either a literal or a `char` array
4. Use it exactly like `cout`

`open()` requires a **C-style string** — not a `std::string`. If your filename is stored in a `std::string`, call
`.c_str()` on it.

Each `ofstream` object maintains its own formatting state independently — `cout.precision(2)` and `outFile.precision(4)`
coexist without interference.

`close()` does not require a filename — the object already knows which file it is associated with. If you omit
`close()`, the file is closed automatically on normal program termination, but explicit closing is good practice,
especially when writing.

> **Caution:** Opening an existing file for output **truncates it to zero bytes by default** — all previous contents are
> permanently discarded. Chapter 17 covers how to override this with append mode.

## Reading from a Text File

File input mirrors `cin` exactly. Where `cin` uses `istream`, file input uses `ifstream` from `<fstream>`:

```cpp
#include <fstream>
#include <cstdlib>   // for exit()

ifstream inFile;
inFile.open("scores.txt");

if (!inFile.is_open())   // always check — file may not exist, access may be denied
{
    cout << "Could not open file\n";
    exit(EXIT_FAILURE);
}

double value;
while (inFile >> value)   // idiomatic — reads and tests in one expression
{
    // process value
}

inFile.close();
```

Everything available on `cin` is available on `ifstream` objects — `>>`, `get()`, `getline()`, `eof()`, `fail()`,
`good()`, and conversion to `bool`.

### Always Check `is_open()`

Many hours of debugging file-reading loops have been wasted because the file never opened in the first place. Causes
include: file doesn't exist, wrong directory, wrong extension, access denied, mistyped name. `is_open()` catches all of
these. The older `good()` method is less thorough — prefer `is_open()` for the opening check.

### File-Reading Loop Design

`good()` reports on the **most recent read attempt** — it cannot look ahead. A read must occur immediately before each
test. The standard pattern keeps one read before the loop and one at the end of the body:

```cpp
inFile >> value;             // read before first test
while (inFile.good())        // test
{
    ++count;
    sum += value;
    inFile >> value;         // read before next test
}
```

The idiomatic condensed form uses the fact that `inFile >> value` returns `inFile`, which converts to `bool` the same
way `inFile.good()` does — `true` on success, `false` on EOF or any failure:

```cpp
while (inFile >> value)      // read and test in one expression
{
    ++count;
    sum += value;
}
```

This is preferred — the read and test are inseparable, making it impossible to accidentally test before reading.

### Diagnosing Loop Termination

After the loop exits, use the state methods to determine why:

```cpp
if (inFile.eof())
    cout << "End of file reached.\n";
else if (inFile.fail())      // also true at EOF, so test eof() first
    cout << "Type mismatch in input.\n";
else
    cout << "Unknown failure.\n";
```

`fail()` returns `true` for both EOF and type mismatch — test `eof()` first to disambiguate. `bad()` catches hardware
failures and corruption. `good()` is the conjunction of all three being false — when `good()` is `false`, exactly one of
the others explains why.

| Method   | Returns `true` when                        |
|----------|--------------------------------------------|
| `good()` | Last read succeeded, no errors, not at EOF |
| `eof()`  | Last read hit end of file                  |
| `fail()` | Last read failed — type mismatch or EOF    |
| `bad()`  | Hardware failure, corrupted stream         |

> **Tip:** Use `while (inFile >> value)` as your default file-reading loop — it is concise, correct, and directly
> mirrors the `while (cin >> value)` pattern for console input. The same short-circuit evaluation rules apply: if combined
> with a bounds check like `while (count < Max && inFile >> value)`, the read never happens if the count condition is
> already false.

## Summary

Programs and programming become more interesting when you introduce statements that guide the program through
alternative actions. (Whether this also makes the programmer more interesting is a point you may wish to investigate.)
C++ provides the if statement, the if else statement, and the switch statement as means for managing choices. The C++ if
statement lets a program execute a statement or statement block conditionally.That is, the program executes the
statement or block if a particular condition is met.The C++ if else statement lets a program select from two choices
which statement or statement block to execute.You can append additional if else statements to such a statement to
present a series of choices. The C++ switch statement directs the program to a particular case in a list of choices.

C++ also provides operators to help in decision-making. Chapter 5 discusses the relational expressions, which compare
two values. The if and if else statements typically use relational expressions as test conditions. By using C++’s
logical operators (&&, ||, and !), you can combine or modify relational expressions to construct more elaborate tests.
The conditional operator (?:) provides a compact way to choose from two values.

The cctype library of character functions provides a convenient and powerful set of tools for analyzing character input.

Loops and selection statements are useful tools for file I/O, which closely parallels console I/O.After you declare
ifstream and ofstream objects and associate them with files, you can use these objects in the same manner you use cin
and cout.

With C++’s loops and decision-making statements, you have the tools for writing interesting, intelligent, and powerful
programs. But we’ve only begun to investigate the real powers of C++. Next, we’ll look at functions.