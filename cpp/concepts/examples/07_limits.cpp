// =============================================================================
// limits.cpp — C++ Numeric Limits Reference
// =============================================================================
//
// HEADERS:
//   <climits>  — C-style macros (INT_MAX, SHRT_MIN, CHAR_BIT, LLONG_MAX, ...)
//   <limits>   — C++ template: numeric_limits<T> — preferred in modern C++
//   <cfloat>   — Float macros (FLT_MAX, DBL_EPSILON, FLT_MIN, ...)
//   <cstdint>  — Fixed-width types (int32_t, uint64_t, ...) + their macros
//
// WHEN TO USE LIMITS:
//   - Sentinel init     : numeric_limits<T>::max() / lowest() to seed min/max searches
//   - Overflow guard    : check against INT_MAX before arithmetic to avoid UNDEFINED BEHAVIOR (UB)
//   - Float comparison  : never use == on floats, use epsilon() for tolerance checks
//   - Stream ignore     : cin.ignore(numeric_limits<streamsize>::max(), '\n')
//   - Generic templates : numeric_limits<T> works for any numeric type T
//   - Safe casts        : validate range before narrowing (int64 -> int32)
//   - Cross-platform    : use <cstdint> when size must be guaranteed (protocols, files)
//
// KEY RULES:
//   - Signed overflow is UNDEFINED BEHAVIOR — compiler may optimize it away or crash
//   - Unsigned overflow is WELL-DEFINED — wraps modulo 2^N (e.g. UINT_MAX + 1 == 0)
//   - float::min() != float::lowest()
//       min()    = smallest POSITIVE normalized value (~1.18e-38)
//       lowest() = most NEGATIVE value (~-3.4e+38)  <-- use this for accumulators
//   - long is platform-dependent: 32-bit on MSVC, 64-bit on GCC/Clang (Linux/macOS)
//     Prefer int32_t / int64_t when size matters
//   - streamsize is signed and implementation-defined (usually ptrdiff_t / int64_t)
//     Always use numeric_limits<streamsize>::max() in cin.ignore(), not INT_MAX
//
// CANONICAL PATTERNS:
//   // Clear cin after bad input:
//   cin.clear();
//   cin.ignore(numeric_limits<streamsize>::max(), '\n');
//
//   // Safe float comparison:
//   bool eq = std::abs(a - b) <= numeric_limits<float>::epsilon() * std::abs(a);
//
//   // Generic min-search sentinel:
//   T result = numeric_limits<T>::max();
//
//   // Overflow guard before addition:
//   if (a > INT_MAX - b) { /* would overflow */ }
//
// =============================================================================

#include <iostream>
#include <climits>
#include <limits>
#include <cstdint>
#include <cfloat>

int main() {
    using namespace std;

    // ─────────────────────────────────────────────────────────────────────────
    // Integer sizes and limits
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Integer Types ===\n";
    cout << "short     : " << sizeof(short)     << " bytes | " << SHRT_MIN  << " to " << SHRT_MAX   << "\n";
    cout << "int       : " << sizeof(int)       << " bytes | " << INT_MIN   << " to " << INT_MAX    << "\n";
    cout << "long      : " << sizeof(long)      << " bytes | " << LONG_MIN  << " to " << LONG_MAX   << "\n";
    cout << "long long : " << sizeof(long long) << " bytes | " << LLONG_MIN << " to " << LLONG_MAX  << "\n";
    cout << "CHAR_BIT  : " << CHAR_BIT          << " bits per byte\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Fixed-width types — use these when size must be exact across platforms
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Fixed-Width Types (<cstdint>) ===\n";
    cout << "int32_t  max : " << numeric_limits<int32_t>::max() << "\n";
    cout << "uint32_t max : " << numeric_limits<uint32_t>::max() << "\n";
    cout << "int64_t  max : " << numeric_limits<int64_t>::max() << "\n";
    cout << "uint64_t max : " << numeric_limits<uint64_t>::max() << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Float limits — note min() vs lowest() distinction
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Float Limits ===\n";
    cout << "float  min()    : " << numeric_limits<float>::min() << "  (smallest positive normalized)\n";
    cout << "float  lowest() : " << numeric_limits<float>::lowest() << "  (most negative — use for accumulators)\n";
    cout << "float  max()    : " << numeric_limits<float>::max() << "\n";
    cout << "float  epsilon(): " << numeric_limits<float>::epsilon() << "  (use for float equality tolerance)\n\n";

    cout << "double min()    : " << numeric_limits<double>::min() << "\n";
    cout << "double lowest() : " << numeric_limits<double>::lowest() << "\n";
    cout << "double epsilon(): " << numeric_limits<double>::epsilon() << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Unsigned overflow — well-defined wrapping (not UB)
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Unsigned Overflow (well-defined wrapping) ===\n";
    unsigned int u = UINT_MAX;
    cout << "UINT_MAX     : " << u << "\n";
    cout << "UINT_MAX + 1 : " << (u + 1u) << "  (wraps to 0)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // streamsize — correct type for cin.ignore()
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== streamsize ===\n";
    cout << "numeric_limits<streamsize>::max() : " << numeric_limits<streamsize>::max() << "\n";
    cout << "// usage: cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n\n";

    return 0;
}
