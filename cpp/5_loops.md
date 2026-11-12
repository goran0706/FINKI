# **C++ Expressions, Operators, and Language Mechanics**

## **Expressions and Statements**

Every value or valid combination of values and operators is an **expression**, and every expression has a value —
including assignments:

```cpp
x = 20        // expression with value 20
x = y = z = 0 // chains right-to-left: z=0, then y=0, then x=0
age = 100;    // expression statement — add semicolon, you get a statement
```

Adding a semicolon to any expression makes it a statement. The reverse isn't true — **declarations**, **return
statements**, and **for statements** are not expressions:

```cpp
// ❌ declarations are not expressions
eggs = int toad * 1000;
cin >> int toad;
```

### Operators

#### Relational Operators

| Operator | Meaning                  |
|----------|--------------------------|
| `<`      | Less than                |
| `<=`     | Less than or equal to    |
| `==`     | Equal to                 |
| `>`      | Greater than             |
| `>=`     | Greater than or equal to |
| `!=`     | Not equal to             |

Lower precedence than arithmetic operators: `x + 3 > y - 2` evaluates as `(x + 3) > (y - 2)`.

#### `=` vs `==` — the most common C++ bug

```cpp
if (x == 4) { }  // ✅ comparison
if (x = 4)  { }  // ❌ always true, assigns 4 to x
```

#### Combination Assignment Operators

| Operator | Equivalent  |
|----------|-------------|
| `k += 3` | `k = k + 3` |
| `k -= 3` | `k = k - 3` |
| `k *= 3` | `k = k * 3` |
| `k /= 3` | `k = k / 3` |
| `k %= 3` | `k = k % 3` |

Left operand must be assignable — `34 += 10` doesn't compile.

#### Increment and Decrement Operators

| Form  | Behavior                             |
|-------|--------------------------------------|
| `++x` | Increment first, return new value    |
| `x++` | Return current value, then increment |
| `--x` | Decrement first, return new value    |
| `x--` | Return current value, then decrement |

```cpp
int x = 5;
int y = ++x;  // y = 6, x = 6
int z = 5;
int w = z++;  // w = 5, z = 6
```

When the value isn't used (e.g., standalone `i++` in a loop), prefix and postfix are identical for built-in types. For
**class types**, prefer prefix — postfix must stash a copy before incrementing, which has overhead.

##### With Pointers

Increment/decrement on pointers follow pointer arithmetic — they advance by `sizeof(pointed-to type)`:

```cpp
double arr[] = {21.1, 32.8, 23.4, 45.2, 37.4};
double *pt = arr;  // → arr[0]
++pt;              // → arr[1]

*++pt   // increment pointer, dereference new address → arr[2]
++*pt   // dereference, increment the value at that address
*pt++   // dereference current address, then increment pointer
(*pt)++ // dereference, increment the pointed-to value
```

#### The Comma Operator

Combines two expressions into one, evaluated left-to-right. The overall value is the **right operand's value**:

```cpp
++j, --i           // both execute; used in for loop update
i = 20, j = 2 * i  // i=20 first (sequence point), then j=40; expression value is 40
cats = (17, 240);   // cats = 240 — right operand wins
cats = 17, 240;     // cats = 17 — parsed as (cats=17), 240
```

The comma in `int i, j;` is a **list separator**, not the comma operator — they're different things.

### Side Effects and Sequence Points

A **side effect** is when evaluating an expression modifies memory. A **sequence point** guarantees all pending side
effects are resolved before execution continues. The three main sequence points:

- Semicolon (end of statement)
- End of a full expression (e.g., a `while` condition)
- The comma operator

This matters most with `++`/`--`:

```cpp
while (guests++ < 10)       // full expression — increment guaranteed before next iteration
    cout << guests << endl;

y = (4 + x++) + (6 + x++);  // ❌ undefined order — don't do this
```

> **Warning:** Never modify the same variable more than once in the same expression. `x = 2 * x++ * (3 - ++x)` is
> undefined behavior.

### Blocks and Scope

Braces create a **compound statement** that counts as a single statement syntactically, and introduces a new scope:

```cpp
int x = 20;
{
    int y = 100;  // y only lives here
    cout << x;    // ✅ outer x visible
    cout << y;    // ✅
}
cout << y;        // ❌ y is gone
```

An inner declaration with the same name **shadows** the outer variable until the block ends.

### String Comparison

Relational operators on `char[]` compare **addresses**, not content:

```cpp
// ❌ compares pointers
if (word == "mate") { }

// ✅ use strcmp from <cstring>
if (strcmp(word, "mate") == 0) { }  // equal
if (strcmp(str1, str2) < 0)   { }  // str1 comes before str2
if (strcmp(str1, str2) > 0)   { }  // str1 comes after str2
```

`strcmp` sorts by **ASCII collating sequence** — uppercase precedes lowercase, so `"Zoo"` < `"aviary"`. String identity
is determined by null terminator, not array size.

`std::string` overloads all relational operators — just use them directly:

```cpp
string word = "hello";
if (word != "mate") { }   // ✅ works, no strcmp needed
if (word == other)  { }   // ✅ compares content, not addresses
```

## **The `for` Loop**

The `for` loop packages initialization, condition testing, and update into a single, scannable control section:

```cpp
for (initialization; test-expression; update-expression)
    body
```

The **four operational steps** per cycle:

1. **Initialization** — executed once before the loop begins; typically sets a counter variable
2. **Test** — evaluated before each iteration; loop executes body only while `true`
3. **Body** — the statement (or compound block) executed each iteration
4. **Update** — evaluated after the body executes; typically advances the counter

```cpp
for (int i = 0; i < 5; i++)
    cout << "iteration " << i << "\n";
```

Output:

```
iteration 0
iteration 1
iteration 2
iteration 3
iteration 4
```

The `for` loop is an **entry-condition loop** — the test is evaluated before each iteration, including the first. If the
condition is false on entry, the body never executes:

```cpp
for (int i = 0; i < 0; i++)
    cout << "never runs\n";  // body skipped entirely
```

### Test Expression Mechanics

`test-expression` is evaluated as a `bool`. C++ type-casts any expression to `bool` for this purpose:

- `0` → `false` → loop terminates
- Any nonzero value → `true` → loop continues

```cpp
for (int i = limit; i; i--)   // terminates when i reaches 0
    cout << "i = " << i << "\n";
```

Relational expressions evaluate to `bool` (`true`/`false`), which convert to `1`/`0` when integer values are expected —
this is what makes `i < 5` work as a loop termination condition.

### Initialization: Declaring Variables Inside `for`

C++ allows a variable to be declared directly in the initialization expression:

```cpp
for (int i = 0; i < 5; i++)
    cout << i << "\n";
```

A variable declared in the `for` initialization **exists only within the `for` statement**. It is destroyed when the
loop exits:

```cpp
for (int i = 0; i < 5; i++)
    cout << i << "\n";

cout << i << endl;  // ❌ won't compile — i is out of scope
```

> **Note:** Some older C++ implementations treated loop-declared variables as if declared before the loop, keeping them
> in scope afterward. Modern C++ does not.

The formal syntax was adjusted to accommodate this — `for-init-statement` is defined as either an expression-statement
or a declaration (both of which carry their own semicolon), which is why the initialization section has a semicolon but
is parsed as a statement rather than a bare expression.

### Update Expression Flexibility

The update expression can be any valid C++ expression — it is not restricted to simple increment/decrement:

```cpp
// Count by user-defined step
for (int i = 0; i < 100; i = i + step)
    cout << i << "\n";

// Multiple updates via comma operator
for (int j = 0, i = word.size() - 1; j < i; --i, ++j)
{
    swap(word[i], word[j]);
}
```

> **Tip:** When a loop skips over a target value, test with `!=` rather than `==`. For example, if step is `17`, the
> value `100` is never hit, so `i == 100` never becomes `true` and the loop runs forever.

### Compound Body and Blocks

The `for` body is syntactically a **single statement**. Use a block to include multiple statements:

```cpp
for (int i = 1; i <= 5; i++)
{
    cout << "Value " << i << ": ";
    cin >> number;
    sum += number;
}
```

Variables declared inside the loop body block are local to that block. Declaring a variable like `temp` inside the loop
is valid but may incur allocation/deallocation overhead per iteration compared to declaring it once before the loop.

### Using the Loop Counter in the Body

The loop counter variable is available throughout the loop body and can participate in calculations:

```cpp
const int ArSize = 16;
long long factorials[ArSize];
factorials[0] = factorials[1] = 1LL;

for (int i = 2; i < ArSize; i++)
    factorials[i] = i * factorials[i - 1];

for (int i = 0; i < ArSize; i++)
    std::cout << i << "! = " << factorials[i] << std::endl;
```

> **Tip:** Define a `const` value for array size and use it consistently in both the array declaration and any loops
> that index into it. Changing one constant propagates everywhere, eliminating fragile magic numbers.

The index range for an array of `ArSize` elements runs from `0` to `ArSize - 1`, so the correct test is `i < ArSize`,
not `i <= ArSize - 1` (equivalent, but less readable).

### Iterating Over Strings

Both `char` arrays and `string` objects support array-notation character access inside a `for` loop.

**Reverse display** using `string::size()`:

```cpp
string word;
cin >> word;

for (int i = word.size() - 1; i >= 0; i--)
    cout << word[i];
```

`size()` returns the character count excluding the null terminator. Initializing `i` to `size() - 1` positions it at the
last character; `>=0` ensures the first character is also printed.

**In-place string reversal** using the comma operator for dual-variable control:

```cpp
string word;
cin >> word;
char temp;
int i, j;

for (j = 0, i = word.size() - 1; j < i; --i, ++j)
{
    temp = word[i];
    word[i] = word[j];
    word[j] = temp;
}
```

The test `j < i` stops the loop at the midpoint. Continuing past center would swap characters back to their original
positions. `i` and `j` are declared before the loop because the comma operator cannot combine two separate
declarations — it can only combine expressions.

```cpp
// ✅ Single declaration initializing both variables — comma is a list separator here
int j = 0, i = word.size() - 1;

// ✅ Comma operator combining two update expressions in for
for (...; ...; --i, ++j)
```

### Non-Counting Loops with `for`

`for` loops don't have to count. Any expression that evaluates to `bool` can drive termination:

```cpp
// Terminate when strcmp signals a match
for (char ch = 'a'; strcmp(word, "mate"); ch++)
{
    cout << word << endl;
    word[0] = ch;
}
```

`strcmp(word, "mate")` returns `0` (false) when the strings match, ending the loop. Using the function return value
directly as the condition is idiomatic C/C++ — `strcmp(word, "mate") != 0` is equivalent but verbose.

```cpp
// Terminate when string object matches
for (char ch = 'a'; word != "mate"; ch++)
{
    cout << word << endl;
    word[0] = ch;
}
```

The `string` class overloads `!=`, allowing comparison with either a `string` object or a C-style string literal on the
right-hand side. For loops driven by a condition rather than a counter, `while` loops are often preferred
stylistically — but `for` is fully capable of the same behavior.




































--------------------

## **The `while` Loop**

The `while` loop is the most fundamental loop construct in C++ — stripped down to just a condition and a body, with no
built-in initialization or update mechanism:

```cpp
while (test-condition)
    body
```

It is an **entry-condition loop**, meaning the condition is fully evaluated before every iteration, including the first.
If the condition is false on entry, the body never executes — not even once. The condition can be any expression that
resolves to `bool`, and C++ will implicitly convert numeric types, pointers, and other expressions accordingly: zero and
null evaluate to `false`, everything else to `true`.

Because `while` carries no structural slots for initialization or update, it places full responsibility on the
programmer to manage loop state. This makes it the natural choice when termination is not a simple counter but something
that evolves during execution — pointer traversal, sentinel detection, state machines, or waiting on external input:

```cpp
while (name[i])                // null char = 0 = false, walks until string terminator
{
    cout << name[i] << ": " << int(name[i]) << endl;
    i++;
}

while (*ptr != nullptr)        // unknown list length — termination discovered at runtime
    process(*ptr++);

while (!queue.empty())         // state-driven — loop itself reveals when to stop
    process(queue.pop());
```

### `for` vs `while`

The real distinction is about **what you know at the time you write the loop**. Use `for` when the iteration is *
*bounded and predictable** — you know the range, the count, or the step upfront:

```cpp
for (int i = 0; i < arr.size(); i++)  // known range
for (int i = 0; i < n; i++)           // known count
for (char c = 'a'; c <= 'z'; c++)     // known domain
```

Use `while` when termination depends on something **discovered at runtime** — input, a flag, a pointer reaching a
sentinel, a stream ending, or a condition emerging from computation:

```cpp
while (cin >> value)                       // don't know how many values are coming
while (ptr->next != nullptr)               // don't know the list length
while (!converged)                         // termination depends on computation result
while (attempts < maxRetries && !success)  // external state drives the loop
```

Two additional differences worth knowing:

- **Scope** — a variable declared in `for`'s init expression is destroyed when the loop exits. With `while`, the
  variable lives before and after the loop, which is useful when you need to inspect its final state after termination.
- **`continue` behavior** — in `for`, `continue` still executes the update expression before rechecking the condition.
  In `while`, `continue` jumps directly back to the condition, bypassing any update logic at the bottom of the body —
  silently producing an infinite loop if you're not careful:

```cpp
// ❌ infinite loop — i++ never reached when skip is true
while (i < 10)
{
    if (skip) continue;
    process(i);
    i++;
}

// ✅ ensure update executes on all code paths
while (i < 10)
{
    if (skip) { i++; continue; }
    process(i++);
}
```

## **The `do while` Loop**

The `do while` loop is the only **exit-condition loop** in C++. Unlike `for` and `while`, it evaluates the condition
*after* the body executes, unconditionally guaranteeing at least one iteration regardless of the condition's initial
value:

```cpp
do
    body
while (test-expression);
```

The practical value is precise: it eliminates the awkward workarounds that `while` requires when you need a result from
the body before the condition can be meaningfully evaluated. User input validation is the clearest example — you cannot
check whether input is valid before you have obtained it:

```cpp
// ✅ with while — requires a sentinel value purely to satisfy the first check
int n = -1;
while (n < 1 || n > 10)
    cin >> n;

// ✅ with do while — no sentinel, expresses the actual logic directly
int n;
do {
    cin >> n;
} while (n < 1 || n > 10);
```

Outside of that specific pattern, `do while` sees limited use. Entry-condition loops are generally preferred because
they are safer — a `while` or `for` with a false initial condition does nothing, whereas a `do while` always executes at
least once, which can produce incorrect behavior if the initial state is invalid.

> **Caution:** When the loop body grows long, the termination condition becomes visually buried at the bottom and easy
> to miss during code review. In those cases, a `while(true)` with explicit `break` statements at logical exit points is
> often clearer:

```cpp
while (true)
{
    cin >> input;
    if (!validate(input)) break;
    process(input);
    if (done(input)) break;
}
```

## **The Range-Based `for` Loop (C++11)**

The range-based `for` loop is designed for one specific job: iterating over every element in a range — an array,
container, or initializer list — without managing an index or iterator manually:

```cpp
double prices[5] = {4.99, 10.99, 6.87, 7.99, 8.49};

for (double x : prices)
    cout << x << endl;
```

By default, `x` is a **copy** of each element — modifying it does nothing to the original. To modify the collection in
place, declare the loop variable as a **reference**:

```cpp
for (double &x : prices)
    x *= 0.80;  // modifies the actual array elements
```

Works on initializer lists too, though that's rarely useful beyond quick iteration:

```cpp
for (int x : {3, 5, 2, 8, 6})
    cout << x << " ";
```

> **Tip:** In real code, almost always use `const auto &` for read-only iteration and `auto &` for mutation. This avoids
> unnecessary copies for complex types and adapts automatically when the collection's type changes:

```cpp
for (const auto &x : prices)   // read — no copy, works for any element type
    cout << x << endl;

for (auto &x : prices)          // write — modify in place
    x *= 0.80;
```

The range-based `for` only works when you need **every element in order**. The moment you need an index, need to skip
elements, iterate in reverse, or stop early based on position, you're back to a regular `for` loop.

## Loop Design

Regardless of which loop form you use, every loop requires three things: the termination condition must be
**identified**, **initialized** before the first test, and **updated** during each iteration so termination is
eventually reached.`for` enforces all three structurally by giving each a dedicated slot in its syntax.
`while` and `do while` leave all of that to the programmer — which is precisely where logic bugs appear, not as syntax
errors, but as conditions that are never initialized correctly or never updated across all code paths through the body.

## **Loops and Text Input**

### The Problem with Plain `cin`

The natural instinct for character input is `cin >> ch`, but `cin` skips whitespace — spaces, tabs, and newlines are
silently discarded. For any program that needs to process every character in the input, including whitespace, plain
`cin` is the wrong tool:

```cpp
cin >> ch;  // ❌ spaces and newlines never reach ch
```

### `cin.get(ch)`

`cin.get(ch)` reads the next character from input without skipping anything — spaces, tabs, newlines all come through:

```cpp
cin.get(ch);
while (ch != '#')
{
    cout << ch;
    ++count;
    cin.get(ch);
}
```

The argument is passed as a **reference**, so the function modifies `ch` directly — unlike typical C behavior where
you'd need to pass `&ch`. This works because the `iostream` header declares the parameter as a reference type.

> **Note:** Input through `cin` is **buffered** — characters don't reach the program until the user presses Enter. This
> means a user can type past a sentinel character like `#` on the same line; the program will simply stop processing at
> the sentinel and ignore the rest.

### EOF Detection

Using a sentinel character like `#` is fragile — it might be legitimate input. The proper solution is detecting 
**end-of-file (EOF)**. On most systems you can simulate EOF from the keyboard:

- **Unix/Linux** — `Ctrl+D` at the start of a line
- **Windows** — `Ctrl+Z` then `Enter`

When `cin` detects EOF it sets two internal flags — `eofbit` and `failbit`. You can test for them with `cin.fail()` or
`cin.eof()`, but these report the result of the **last read attempt** — always test after attempting to read, never
before.

The idiomatic EOF loop with `cin.get(ch)` progressively condenses to its most practical form:

```cpp
// verbose
cin.get(ch);
while (cin.fail() == false) { ... cin.get(ch); }

// idiomatic — cin converts to bool: true if last read succeeded, false otherwise
while (cin.get(ch))
{
    // process ch
}
```

The last form is preferred — `cin.get(ch)` is called once in the condition, returns the `cin` object, which converts to
`true` on success and `false` on EOF or any other failure. This is more general than `!cin.fail()` because it also
catches failures like disk errors.

> **Caution:** Once EOF is detected, `cin` stops reading entirely — further calls have no effect. To resume reading
> after a simulated EOF, call `cin.clear()` to reset the flags. On some systems, `Ctrl+Z` terminates I/O permanently
> beyond what `cin.clear()` can restore.

### `cin.get()` — No-Argument Form

The no-argument version returns the character as an `int` rather than assigning it to a variable:

```cpp
int ch;
while ((ch = cin.get()) != EOF)
{
    cout.put(char(ch));
    ++count;
}
```

Two critical points here:

**Use `int`, not `char`** — `cin.get()` returns `EOF` as a special `int` value (typically `-1`). If you store it in a
`char`, and `char` is unsigned on your platform, `-1` wraps to `255` and the EOF check never triggers — an infinite loop
with no obvious cause.

**Parentheses are mandatory** in the condition — operator precedence makes them non-optional:

```cpp
while ((ch = cin.get()) != EOF)  // ✅ assigns first, then compares
while  (ch = cin.get() != EOF)   // ❌ compares first, assigns 0 or 1 to ch
```

### `cin.get(ch)` vs `cin.get()` — Which to Use

|                    | `cin.get(ch)`                      | `ch = cin.get()`               |
|--------------------|------------------------------------|--------------------------------|
| **Input delivery** | Assigns to argument by reference   | Returns value, assign manually |
| **Return value**   | `istream` object                   | `int` character code           |
| **At EOF**         | Returns `istream` object → `false` | Returns `EOF`                  |
| **Variable type**  | `char`                             | Must be `int`                  |
| **Chainable**      | ✅ `cin.get(ch1).get(ch2)`          | ❌                              |

Prefer `cin.get(ch)` — it integrates naturally with the object model, is chainable, and avoids the `int`/`char` type
hazard entirely. The `cin.get()` form exists mainly as a drop-in replacement when migrating C code that uses
`getchar()`/`putchar()`.

## **Nested Loops and Two-Dimensional Arrays**

### What is a 2D Array

C++ has no built-in matrix type. A two-dimensional array is simply an **array of arrays** — each element of the outer
array is itself an array:

```cpp
int maxtemps[4][5];  // array of 4 elements, each being an array of 5 ints
```

Mentally model this as a table — first index is the **row**, second is the **column**. In memory however, C++ stores 2D
arrays in **row-major order** — all elements of row 0 come first, then row 1, and so on, as one contiguous block. This
has real performance implications: iterating row-by-row is cache-friendly, iterating column-by-column is not:

```cpp
// ✅ cache-friendly — walks memory sequentially
for (int row = 0; row < 4; row++)
    for (int col = 0; col < 5; col++)
        process(maxtemps[row][col]);

// ❌ cache-unfriendly — jumps through memory with every access
for (int col = 0; col < 5; col++)
    for (int row = 0; row < 4; row++)
        process(maxtemps[row][col]);
```

### Initialization

Each row is initialized as its own brace-enclosed list:

```cpp
int maxtemps[4][5] =
{
    {96, 100, 87, 101, 105},  // row 0
    {96,  98, 91, 107, 104},  // row 1
    {97, 101, 93, 108, 107},  // row 2
    {98, 103, 95, 109, 108}   // row 3
};
```

If you omit the inner braces, C++ fills elements sequentially and zero-initializes anything remaining — but always use
inner braces for clarity. Partial initialization zero-fills the rest:

```cpp
int grid[3][3] = {{1, 2}, {3}};
// grid[0] = {1, 2, 0}
// grid[1] = {3, 0, 0}
// grid[2] = {0, 0, 0}
```

Zero-initializing the entire array:

```cpp
int grid[4][5] = {};   // all elements set to 0
int grid[4][5] = {0};  // same effect
```

### Traversal with Nested Loops

The outer loop drives rows, the inner loop drives columns — directly mirroring the two-subscript access pattern:

```cpp
for (int row = 0; row < 4; row++)
{
    for (int col = 0; col < 5; col++)
        cout << maxtemps[row][col] << "\t";
    cout << endl;
}
```

Always use named constants for dimensions — they appear in the array declaration, both loop bounds, and any function
signatures. A magic number buried in three places is a maintenance trap:

```cpp
const int ROWS = 4;
const int COLS = 5;

int maxtemps[ROWS][COLS];

for (int row = 0; row < ROWS; row++)
    for (int col = 0; col < COLS; col++)
        process(maxtemps[row][col]);
```

### Passing 2D Arrays to Functions

This is where 2D arrays get awkward. When passing to a function, **the first dimension can be omitted but the second
must be specified** — because the compiler needs the column count to calculate memory offsets correctly:

```cpp
// ✅ correct — second dimension required
void process(int arr[][5], int rows);

// ❌ won't compile — compiler can't calculate offsets without column count
void process(int arr[][], int rows);
```

This hardcodes the column size into the function signature, making the function only usable with arrays of that exact
width. For truly generic matrix functions, use templates or `std::vector<std::vector<T>>`.

### String Storage Options for Arrays

When building an array of strings, three approaches exist with different trade-offs:

**Array of `const char*` pointers** — stores only the addresses of string literals. Minimal memory, but strings are not
modifiable:

```cpp
const char *cities[5] = {"Alpha", "Beta", "Gamma", "Delta", "Epsilon"};
```

**2D `char` array** — copies each string into a fixed-size buffer. Modifiable, but wastes space if strings vary in
length, and you must size the second dimension for the longest possible string:

```cpp
char cities[5][25] = {"Alpha", "Beta", "Gamma", "Delta", "Epsilon"};
```

**Array of `std::string`** — best of both: modifiable, no fixed size limit, automatic memory management:

```cpp
string cities[5] = {"Alpha", "Beta", "Gamma", "Delta", "Epsilon"};
```

All three use identical initialization syntax and identical loop traversal code — the difference is purely in memory
layout, mutability, and safety.

> **Tip:** In modern C++, prefer `std::vector<std::vector<T>>` over raw 2D arrays for anything beyond simple fixed-size
> grids. It eliminates the fixed-dimension problem in function signatures, supports dynamic sizing, and manages memory
> automatically. Raw 2D arrays are still appropriate for performance-critical fixed-size work like matrix math or
> embedded systems.

## Summary

C++ offers three varieties of loops: for loops, while loops, and do while loops.A loop cycles through the same set of
instructions repetitively, as long as the loop test condition evaluates to true or nonzero and the loop terminates
execution when the test condition evaluates to false or zero.The for loop and the while loop are entry-condition
loops, meaning that they examine the test condition before executing the statements in the body of the loop.The do while
loop is an exit-condition loop, meaning that it examines the test condition after executing the statements in the body
of the loop.

The syntax for each loop calls for the loop body to consist of a single statement. However, that
statement can be a compound statement, or block, formed by enclosing several statements within paired curly braces.

Relational expressions, which compare two values, are often used as loop test conditions. Relational expressions are
formed by using one of the six relational operators: <, <=, ==, >=, >, or !=. Relational expressions evaluate to the
type bool values true and false.

Many programs read text input or text files character-by-character.The istream class
provides several ways to do this. If ch is a type char variable, the following statement reads the next input character
into ch: cin >> ch;

However, it skips over spaces, newlines, and tabs.The following member function call reads the next
input character, regardless of its value, and places it in ch: cin.get(ch);

The member function call cin.get() returns
the next input character, including spaces, newlines, and tabs, so it can be used as follows: ch = cin.get();

The cin.get(char) member function call reports encountering the EOF condition by returning a value with the bool
conversion of false, whereas the cin.get() member function call reports the EOF by returning the value EOF, which is
defined in the iostream file.

A nested loop is a loop within a loop. Nested loops provide a natural way to process two-dimensional arrays.