#include <iostream>
using namespace std;

// =============================================================================
// SYMBOLIC CONSTANTS — THREE APPROACHES COMPARED
// =============================================================================
//
// At a glance:
//   #define NAME value         → Preprocessor text substitution. No type. No scope.
//   const T name = value       → Runtime constant. Has type. Respects scope.
//   constexpr T name = value   → Compile-time constant. Has type. Respects scope.
//                                Prefer this for true constants whenever possible.
//
// Rule of thumb:
//   - Avoid #define for constants in modern C++.
//   - Use constexpr when the value is known at compile time (sizes, math values, flags).
//   - Use const when the value is only known at runtime (e.g. read from a file or input).
//
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────
// 1. #define — Preprocessor Macro
// ─────────────────────────────────────────────────────────────────────────
//
// HOW IT WORKS:
//   The preprocessor does a dumb find-and-replace BEFORE the compiler even sees your code.
//   Every occurrence of GLOBAL_MACRO_PI in source becomes "3.14".
//
// WHAT IT SOLVES:
//   Originally the only way to define constants in C. Still works everywhere,
//   including in older C-style codebases you might need to integrate with.
//
// PROBLEMS:
//   - No type:    The compiler doesn't know if 3.14 is a float, double, or int.
//                 Type mismatches won't be caught.
//   - No scope:   Once defined, it bleeds into every file that includes this one.
//                 You can't limit it to a function or class.
//   - No debugger visibility: Macros are gone by compile time. Debuggers can't
//                 show you the name — only the raw value.
//   - Name collisions: Two headers both defining "PI" silently clobber each other.
//
// WHEN TO USE:
//   - Conditional compilation guards:  #ifdef DEBUG ... #endif
//   - Include guards:                  #ifndef MY_HEADER_H
//   - Platform-specific code branching
//   - Avoid for plain constants — const or constexpr is always better.
#define GLOBAL_MACRO_PI 3.14


// ─────────────────────────────────────────────────────────────────────────
// 2. const — Runtime Constant
// ─────────────────────────────────────────────────────────────────────────
//
// HOW IT WORKS:
//   A typed, named variable that the compiler marks read-only.
//   Its value is "locked in" and cannot be changed after initialization.
//
// WHAT IT SOLVES:
//   Fixes everything wrong with #define:
//   - Has a type        → Type-safe. Compiler catches misuse.
//   - Has               → Obeys the same scoping rules as any variable.
//   - Debugger friendly → The name is visible in debug symbols.
//
// KEY CHARACTERISTIC — "Runtime constant":
//   The value CAN come from a runtime source (user input, function return, etc.)
//   but it cannot change after it is set.
//
//   Example where only const works (not constexpr):
//     int userInput;
//     cin >> userInput;
//     const int MAX = userInput;       // ✅ valid
//     constexpr int MAX = userInput;   // ❌ compile error — not known at compile time
//
// WHEN TO USE:
//   - When the value is only known at runtime (read from config, user input, etc.)
//   - When you want a read-only reference or pointer parameter in a function.
//   - When working with class member variables that don't need compile-time eval.
const double GLOBAL_CONST_PI = 3.14;


// ─────────────────────────────────────────────────────────────────────────
// 3. constexpr — Compile-Time Constant (modern C++, prefer this)
// ─────────────────────────────────────────────────────────────────────────
//
// HOW IT WORKS:
//   Like const, but it makes a STRONGER guarantee: the value MUST be computable at compile time.
//   The compiler evaluates it, bakes the result into the binary,
//   and never allocates memory for it at runtime.
//
// WHAT IT ADDS OVER const:
//   - Compile-time evaluation → Used in contexts that require it (array sizes,
//     template arguments, switch cases, static_assert).
//   - Performance hint → No runtime cost; the value is a literal in the binary.
//   - Stricter guarantee → If the initializer can't be evaluated at compile time,
//     the compiler will give you an error immediately. No surprises.
//
//   Example of something only constexpr can do:
//     constexpr int SIZE = 10;
//     int arr[SIZE];             // ✅ — array size must be compile-time constant
//
//     const int SIZE = 10;       // This also works here, BUT only because the
//     int arr[SIZE];             // compiler can "see" it's a literal. In practice,
//                                // const doesn't guarantee compile-time evaluation.
//
// NOTE — constexpr functions:
//   constexpr can also be applied to functions.
//   If called with compile-time arguments, the function is evaluated at compile time.
//   If called with runtime arguments, it behaves like a regular function.
//
//   constexpr int square(int x) { return x * x; }
//   constexpr int s = square(5);   // evaluated at compile time → s = 25
//
// WHEN TO USE:
//   - Prefer constexpr over const for any literal constant in modern C++.
//   - Mathematical/physical constants (PI, gravity, speeds).
//   - Array sizes, buffer sizes, loop bounds.
//   - Any constant used in templates or static_assert.
constexpr double GLOBAL_CONSTEXPR_PI = 3.14;


// =============================================================================
// QUICK COMPARISON TABLE
// =============================================================================
//
//  Feature                  | #define        | const          | constexpr
//  -------------------------|----------------|----------------|-------------------
//  Type safety              | ❌ None        | ✅ Typed       | ✅ Typed
//  Scope                    | ❌ Global      | ✅ Scoped      | ✅ Scoped
//  Compile-time guaranteed  | ✅ (text swap) | ⚠️ Sometimes  | ✅ Always
//  Runtime value allowed    | ❌ No          | ✅ Yes         | ❌ No
//  Debugger visible         | ❌ No          | ✅ Yes         | ✅ Yes
//  Works as array size      | ✅ Yes         | ⚠️ Depends    | ✅ Yes
//  Works in templates       | ❌ No          | ⚠️ Sometimes  | ✅ Yes
//  Memory allocated         | ❌ No          | ⚠️ Maybe       | ❌ No (usually)
//  Recommended in modern C++| ❌ Avoid       | ✅ When needed | ✅ First choice
//
// =============================================================================


int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // LOCAL SYMBOLIC CONSTANTS
    // ─────────────────────────────────────────────────────────────────────────
    //
    // #define is technically "local" here in terms of source position, but
    // it STILL has no real scope — it remains defined for the rest of the
    // translation unit. This is one more reason to avoid it.
#define LOCAL_MACRO_PI 3.14                 // ⚠️ Not actually scoped to main()
    const double LOCAL_CONST_PI = 3.14; // ✅ Scoped to main()
    constexpr double LOCAL_CONSTEXPR_PI = 3.14; // ✅ Scoped to main(), preferred


    // ─────────────────────────────────────────────────────────────────────────
    // VARIABLE DECLARATION
    // A variable is created but not yet assigned a value.
    // WARNING: reading an uninitialized variable is undefined behavior in C++.
    // ─────────────────────────────────────────────────────────────────────────
    int number;


    // ─────────────────────────────────────────────────────────────────────────
    // VARIABLE ASSIGNMENT
    // Assigning a value after declaration.
    // ─────────────────────────────────────────────────────────────────────────
    number = 10;


    // ─────────────────────────────────────────────────────────────────────────
    // VARIABLE INITIALIZATION
    // Creating a variable and setting its value at the point of declaration.
    //
    //   - Copy initialization        (= syntax)   — allows implicit conversions
    //   - Direct initialization      (() syntax)  — initializes object directly
    //   - Direct-list initialization ({} syntax)  — prevents narrowing conversions
    //   - Copy-list initialization   (= {} syntax) — list initialization with '='
    //   - Value initialization       ({} empty)   — zero-initializes fundamental types
    //
    // Notes:
    //   - List initialization ({}) disallows narrowing conversions.
    //   - Prefer list initialization in modern C++ when applicable.
    //
    // Examples:
    //   int x{3.7};        // ❌ compile error — narrowing double → int
    //   int x = 3.7;       // ⚠️ truncates to 3
    // ─────────────────────────────────────────────────────────────────────────
    // Initialization forms (C++11+)
    int number_a = 10;      // copy initialization
    int number_b(10);       // direct initialization
    int number_c{10};       // direct-list initialization
    int number_d = {10};    // copy-list initialization
    int number_e{};         // value initialization (zero-initialized)


    // ─────────────────────────────────────────────────────────────────────────
    // BUILT-IN (C-STYLE) ARRAYS
    //
    // Array sizes MUST be compile-time constants.
    // This is why constexpr is important — const might not always satisfy this.
    // ─────────────────────────────────────────────────────────────────────────
    constexpr int ARR_SIZE = 10; // constexpr guarantees this is a compile-time value

    // Uninitialized — values are UNDEFINED (garbage). Don't read before writing.
    int numbers1[ARR_SIZE];

    // All elements initialized to 0 via empty braces.
    int numbers2[ARR_SIZE] = {};

    // Explicit first element = 0; remaining elements automatically zero-initialized.
    // (In practice identical to the line above for int arrays.)
    int numbers3[ARR_SIZE] = {0};

    // Uniform initialization syntax — same behavior, modern style.
    int numbers4[ARR_SIZE]{0};


    // ─────────────────────────────────────────────────────────────────────────
    // ACCESSING ARRAY ELEMENTS
    // Zero-indexed. Accessing out-of-bounds is undefined behavior — no runtime
    // exception in C++, unlike Java or Python.
    // Use std::array or std::vector if you want bounds-checked alternatives.
    // ─────────────────────────────────────────────────────────────────────────
    numbers2[0] = 100;
    numbers2[1] = 200;


    // ─────────────────────────────────────────────────────────────────────────
    // PRINT EXAMPLE
    // ─────────────────────────────────────────────────────────────────────────
    cout << "First element:  " << numbers2[0] << endl;
    cout << "Second element: " << numbers2[1] << endl;

    return 0;
}
