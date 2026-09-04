// =============================================================================
// casting.cpp — Type Casting, Promotion, Implicit/Explicit Conversion
// =============================================================================
//
// IMPLICIT CONVERSION (compiler does it automatically):
//   Two categories: widening (safe, promotion) and narrowing (potentially lossy)
//
// WIDENING — safe, no data loss:
//   char  → short → int → long → long long → float → double → long double
//   The compiler promotes operands to the "wider" type before evaluating:
//     int + double  → both become double
//     short + int   → short promoted to int first
//     char * 2      → char promoted to int (integral promotion)
//
//   Integral promotion rule: any type smaller than int (char, short, bool)
//   is promoted to int before arithmetic — even if both operands are char.
//     char a = 'A'; char b = 1;
//     auto r = a + b;  // r is int, not char
//
// NARROWING — potentially lossy, compiler may warn but won't error by default:
//   double → float  : precision loss
//   double → int    : fractional part silently truncated (not rounded)
//   int    → short  : value loss if out of range
//   int    → char   : only low 8 bits kept
//   Narrowing in brace-initialization {} is a compile error in C++11+:
//     int x = 3.7;     // OK, silently truncates to 3 (C-style init)
//     int x {3.7};     // ERROR — narrowing conversion not allowed
//
// USUAL ARITHMETIC CONVERSIONS (both operands in binary expression):
//   1. If either is long double → both become long double
//   2. If either is double      → both become double
//   3. If either is float       → both become float
//   4. Otherwise: integral promotions applied, then:
//      - If same type → done
//      - Signed/unsigned of same rank → signed converts to unsigned
//      - Mixed rank → lower rank converts to higher
//
// EXPLICIT CASTING — 4 styles:
//
//   1. C-style cast:       (double)x      — avoid, no type-safety, does anything
//   2. Functional cast:    double(x)      — same as C-style, slightly cleaner syntax
//   3. static_cast<T>(x)  — PREFERRED: checked at compile time, explicit intent
//   4. Named casts (advanced):
//        static_cast<T>    — safe compile-time conversions (numeric, up/down hierarchy)
//        reinterpret_cast<T> — raw bit reinterpretation (pointers, hardware, unsafe)
//        const_cast<T>     — add/remove const qualifier only
//        dynamic_cast<T>   — safe runtime downcast in polymorphic class hierarchies
//
// CAST SELECTION GUIDE:
//   Numeric conversions          → static_cast<T>
//   Pointer reinterpretation     → reinterpret_cast<T>  (know what you're doing)
//   Remove const from pointer    → const_cast<T>        (avoid if possible)
//   Base* → Derived* safely      → dynamic_cast<T>      (requires virtual + RTTI)
//   Never use C-style in new code — it silently does any of the above
//
// INTEGER DIVISION TRAP:
//   int / int always truncates: 18 / 100 == 0 (not 0.18)
//   Cast at least one operand to double BEFORE the division, not after:
//     double p = part / total * 100;              // WRONG: 0.0
//     double p = static_cast<double>(part) / total * 100;  // CORRECT: 18.0
//
// =============================================================================

#include <iostream>
using namespace std;

int main() {
    int part = 18;
    int total = 100;

    // ─────────────────────────────────────────────────────────────────────────
    // Integer division trap — order of operations matters
    // ─────────────────────────────────────────────────────────────────────────
    double percent = part / total * 100; // int/int = 0 → 0 * 100 = 0.0
    cout << "Without cast   : " << percent << "\n"; // 0

    // ─────────────────────────────────────────────────────────────────────────
    // Explicit casts — all produce 18.0, but differ in safety/clarity
    // ─────────────────────────────────────────────────────────────────────────
    percent = (double) part / total * 100; // C-style — avoid in modern C++
    cout << "C-style cast   : " << percent << "\n";

    percent = double(part) / total * 100; // functional — same as C-style
    cout << "Functional cast: " << percent << "\n";

    percent = static_cast<double>(part) / total * 100; // PREFERRED — compile-time checked
    cout << "static_cast    : " << percent << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Widening — safe, no data loss
    // ─────────────────────────────────────────────────────────────────────────
    short s = 200;
    int i = s; // short → int, implicit, safe
    double d = i; // int   → double, implicit, safe
    cout << "Widening: short(" << s << ") → int(" << i << ") → double(" << d << ")\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Integral promotion — char/short → int in arithmetic
    // ─────────────────────────────────────────────────────────────────────────
    char ca = 'A'; // 65
    char cb = 1;
    auto result = ca + cb; // both promoted to int before addition
    cout << "Integral promotion: 'A'(65) + 1 = " << result
            << " (type is int, not char)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Narrowing — lossy, be explicit
    // ─────────────────────────────────────────────────────────────────────────
    double pi = 3.14159;
    int truncated = static_cast<int>(pi); // fractional part discarded, not rounded
    cout << "Narrowing double→int: " << pi << " → " << truncated << " (truncated)\n";

    int ascii = 97;
    char ch = static_cast<char>(ascii); // int → char, safe if value fits in char
    cout << "Narrowing int→char : " << ascii << " → '" << ch << "'\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Narrowing in brace-init — compile error (uncomment to see)
    // ─────────────────────────────────────────────────────────────────────────
    // int bad {3.7};    // ERROR: narrowing conversion from double to int
    int ok = 3.7; // silently truncates to 3 — old-style init allows this
    cout << "Old-style init int = 3.7 : " << ok << " (silent truncation)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Signed / unsigned mixed arithmetic — implicit conversion to unsigned
    // ─────────────────────────────────────────────────────────────────────────
    unsigned int u = 1;
    int neg = -1;
    // neg converts to unsigned before comparison → becomes a huge number
    bool wrong = (neg < u); // may be false! -1 as unsigned is UINT_MAX
    cout << "Signed/unsigned: -1 < 1u evaluates to " << wrong
            << " (0=false — -1 converts to UINT_MAX)\n";

    return 0;
}
