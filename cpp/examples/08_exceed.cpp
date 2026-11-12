// =============================================================================
// exceed.cpp — Integer Overflow and Wraparound Behavior
// =============================================================================
//
// WHAT THIS DEMONSTRATES:
//   Signed and unsigned integers behave differently when exceeding their limits.
//   This file shows both overflow (signed) and wraparound (unsigned) in action.
//
// SIGNED OVERFLOW (short sam):
//   - Exceeding the max value of a signed type is UNDEFINED BEHAVIOR (UB)
//   - In practice on most platforms: wraps from SHRT_MAX (32767) to SHRT_MIN (-32768)
//   - The compiler is NOT required to preserve this behavior — it can optimize it out
//   - Never rely on signed overflow in production code
//
// UNSIGNED WRAPAROUND (unsigned short sue):
//   - Exceeding the max of an unsigned type is WELL-DEFINED by the C++ standard
//   - Wraps modulo 2^N: USHRT_MAX (65535) + 1 == 0
//   - Going below 0: 0 - 1 == USHRT_MAX (65535)
//   - Safe to rely on; commonly used in checksums, ring buffers, bitmasks
//
// OVERFLOW DIRECTION SUMMARY:
//   signed   max + 1  → UB (typically wraps to most negative value)
//   signed   min - 1  → UB (typically wraps to most positive value)
//   unsigned max + 1  → 0                (wraps, well-defined)
//   unsigned 0   - 1  → UINT/USHRT_MAX   (wraps, well-defined)
//
// HOW TO PREVENT OVERFLOW IN PRODUCTION:
//   // Manual guard:
//   if (a > SHRT_MAX - b) { /* handle overflow */ }
//
//   // GCC/Clang builtin (fast, no UB):
//   int result;
//   if (__builtin_add_overflow(a, b, &result)) { /* handle */ }
//
//   // C++20 / <stdckdint.h> (GCC 13+, Clang 16+):
//   if (ckd_add(&result, a, b)) { /* handle */ }
//
// NOTE ON #define ZERO 0:
//   Preprocessor macros have no type, no scope, and no debugger visibility.
//   Prefer: constexpr short ZERO = 0;
//
// =============================================================================

#include <iostream>
#include <climits>

#define ZERO 0  // preprocessor macro — prefer constexpr in modern C++

int main() {
    using namespace std;

    short sam = SHRT_MAX; // signed short   — max: 32767
    unsigned short sue = sam; // unsigned short — max: 65535, starts at same value

    cout << "Sam has " << sam << " dollars and Sue has " << sue;
    cout << " dollars deposited.\n";
    cout << "Add $1 to each account.\nNow ";

    sam = sam + 1; // signed overflow   — UB, wraps to -32768 on most platforms
    sue = sue + 1; // unsigned overflow — well-defined, wraps to 32768

    cout << "Sam has " << sam << " dollars and Sue has " << sue;
    cout << " dollars deposited.\nPoor Sam!\n\n";

    sam = ZERO;
    sue = ZERO;

    cout << "Sam has " << sam << " dollars and Sue has " << sue;
    cout << " dollars deposited.\n";
    cout << "Take $1 from each account.\nNow ";

    sam = sam - 1; // signed underflow   — UB, wraps to -1 on most platforms
    sue = sue - 1; // unsigned underflow — well-defined, wraps to 65535 (USHRT_MAX)

    cout << "Sam has " << sam << " dollars and Sue has " << sue;
    cout << " dollars deposited.\nLucky Sue!\n";

    return 0;
}
