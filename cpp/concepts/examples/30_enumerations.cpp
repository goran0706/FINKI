// =============================================================================
// enumerations.cpp — Unscoped enum, enum class, Underlying Types, Operations
// =============================================================================
//
// WHAT IS AN ENUMERATION:
//   An enumeration (enum) defines a named type whose values are restricted to
//   a set of named integer constants called enumerators.
//   Enums give meaningful names to otherwise magic numbers, making code
//   self-documenting and harder to misuse.
//
//     int direction = 2;           // what does 2 mean?
//     Direction d = Direction::EAST; // unambiguous
//
// TWO KINDS OF ENUM IN C++:
//   1. Unscoped enum  (C-style):    enum  Color { RED, GREEN, BLUE };
//   2. Scoped enum    (C++11):      enum class Color { RED, GREEN, BLUE };
//   Always prefer enum class in modern C++.
//
// ── UNSCOPED ENUM ─────────────────────────────────────────────────────────
//   enum Color { RED, GREEN, BLUE };
//
//   - Enumerators are injected into the ENCLOSING scope — RED, GREEN, BLUE
//     are visible globally (or wherever the enum is declared).
//   - Implicitly converts to int: int n = RED; // 0
//   - Two enums in the same scope can accidentally clash:
//       enum Color  { RED, GREEN };
//       enum Status { RED, OK };   // ERROR — RED redeclared in same scope
//   - Values start at 0 by default, increment by 1.
//   - You can assign explicit values:
//       enum Weekday { MON=1, TUE, WED, THU, FRI, SAT, SUN }; // TUE=2, WED=3...
//       enum Flags   { A=1, B=2, C=4, D=8 };  // powers of 2 for bitmasks
//   - Multiple enumerators can share the same value.
//
// ── SCOPED ENUM (enum class) ──────────────────────────────────────────────
//   enum class Color { RED, GREEN, BLUE };
//
//   - Enumerators are SCOPED to the enum name: Color::RED, Color::GREEN
//   - NO implicit conversion to int — must static_cast<int>(Color::RED)
//   - NO name pollution in enclosing scope
//   - Two scoped enums can both have a RED enumerator without conflict
//   - All other rules (default values, explicit values) are the same
//   - Preferred in all modern C++ code
//
// UNDERLYING TYPE:
//   By default the underlying integral type is int (implementation-defined for
//   unscoped enums, guaranteed int for scoped enums).
//   You can specify any integral type explicitly:
//     enum class Status : uint8_t  { OK=0, ERROR=1 };   // 1 byte
//     enum class Flags  : uint32_t { A=1, B=2, C=4 };   // 4 bytes
//     enum class Big    : int64_t  { MAX = INT64_MAX };  // 8 bytes
//   Reasons to specify:
//     - Binary serialization / protocol compatibility
//     - Memory savings in large arrays of enums
//     - Interop with C APIs expecting a specific type
//
// CONVERTING BETWEEN ENUM AND INTEGER:
//   enum class Color { RED=0, GREEN=1, BLUE=2 };
//
//   enum → int:   int n = static_cast<int>(Color::RED);    // explicit required for enum class
//   int → enum:   Color c = static_cast<Color>(1);         // Color::GREEN
//                 No range check — casting an out-of-range int is UB for unscoped,
//                 defined (but potentially meaningless) for scoped enums.
//
// ENUM IN SWITCH:
//   switch statements on enum class are exhaustive by default warning — the compiler
//   warns if you're missing a case (with -Wswitch on GCC/Clang).
//   Omit default when you want exhaustive coverage warnings — the compiler will
//   tell you when you add a new enumerator and forget to handle it.
//
// BITFLAG ENUMS:
//   Use enum class with powers-of-2 values and bitwise operators for flag sets.
//   C++ does NOT define bitwise operators for enum class by default — define them:
//     enum class Perm : uint8_t { NONE=0, READ=1, WRITE=2, EXEC=4 };
//     Perm operator|(Perm a, Perm b) {
//         return static_cast<Perm>(static_cast<uint8_t>(a) | static_cast<uint8_t>(b));
//     }
//     Perm p = Perm::READ | Perm::WRITE;
//   Or use a plain unscoped enum for flags (implicit int conversion makes ops easier),
//   but scope it inside a namespace or struct to avoid pollution.
//
// ENUM FORWARD DECLARATION:
//   Scoped enums can be forward-declared (underlying type must be known):
//     enum class Color : int;     // forward declaration
//     void process(Color c);      // can use in function signature
//     enum class Color : int { RED, GREEN, BLUE };  // definition elsewhere
//   Unscoped enums cannot be forward-declared unless underlying type is specified.
//
// std::to_string / PRINTING ENUMS:
//   Enums have no built-in string conversion — you must provide one:
//   - switch/case returning const char* or std::string_view (fast, zero alloc)
//   - std::map<EnumType, string> lookup table
//   - C++23: std::to_underlying(e) converts to underlying type cleanly
//   - Magic Enum library (third-party): compile-time reflection for enum names
//
// COMMON PITFALLS:
//   1. Using unscoped enum and getting namespace pollution / name clashes
//   2. Relying on implicit int conversion for enum class (won't compile)
//   3. Casting arbitrary int to enum without range validation
//   4. Using default in switch — suppresses exhaustiveness warnings
//   5. Forgetting to define bitwise operators for flag-style enum class
//   6. Assuming enumerator values are contiguous when explicit values are set
//
// =============================================================================

#include <iostream>
#include <string_view>
#include <cstdint>
using namespace std;

// ─────────────────────────────────────────────────────────────────────────
// Unscoped enum — enumerators in enclosing scope, implicit int conversion
// ─────────────────────────────────────────────────────────────────────────
enum Direction { NORTH, SOUTH, EAST, WEST }; // NORTH=0, SOUTH=1, ...

// ─────────────────────────────────────────────────────────────────────────
// Scoped enum — enumerators scoped, no implicit int conversion (PREFERRED)
// ─────────────────────────────────────────────────────────────────────────
enum class Color { RED, GREEN, BLUE };

// ─────────────────────────────────────────────────────────────────────────
// Explicit underlying type — controls size and range
// ─────────────────────────────────────────────────────────────────────────
enum class Status : uint8_t { OK = 0, WARNING = 1, ERROR = 2 };

// ─────────────────────────────────────────────────────────────────────────
// Explicit values — useful for protocol codes, HTTP status, etc.
// ─────────────────────────────────────────────────────────────────────────
enum class HttpStatus : uint16_t {
    OK = 200,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
};

// ─────────────────────────────────────────────────────────────────────────
// Bitflag enum class — powers of 2, bitwise operators defined manually
// ─────────────────────────────────────────────────────────────────────────
enum class Perm : uint8_t {
    NONE = 0,
    READ = 1, // 0b00000001
    WRITE = 2, // 0b00000010
    EXEC = 4, // 0b00000100
};

Perm operator|(Perm a, Perm b) {
    return static_cast<Perm>(static_cast<uint8_t>(a) | static_cast<uint8_t>(b));
}

Perm operator&(Perm a, Perm b) {
    return static_cast<Perm>(static_cast<uint8_t>(a) & static_cast<uint8_t>(b));
}

bool hasFlag(Perm set, Perm flag) {
    return (set & flag) == flag;
}

// ─────────────────────────────────────────────────────────────────────────
// Helper: enum → string (switch is fastest, zero allocation)
// ─────────────────────────────────────────────────────────────────────────
string_view colorName(Color c) {
    switch (c) {
        case Color::RED: return "RED";
        case Color::GREEN: return "GREEN";
        case Color::BLUE: return "BLUE";
    }
    return "UNKNOWN"; // unreachable if enum is exhaustive
}

string_view statusName(Status s) {
    switch (s) {
        case Status::OK: return "OK";
        case Status::WARNING: return "WARNING";
        case Status::ERROR: return "ERROR";
    }
    return "UNKNOWN";
}

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Unscoped enum — no scope prefix, implicit int
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Unscoped enum ===\n";
    Direction d = NORTH; // no prefix needed
    cout << "NORTH = " << NORTH << "\n"; // 0 — implicit int conversion
    cout << "SOUTH = " << SOUTH << "\n"; // 1
    cout << "d     = " << d << "\n"; // 0
    int n = EAST; // implicit conversion to int — allowed
    cout << "EAST as int = " << n << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Scoped enum — must use Color::, no implicit int
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Scoped enum (enum class) ===\n";
    Color c = Color::GREEN;
    cout << "colorName: " << colorName(c) << "\n";

    // explicit cast to int
    int ci = static_cast<int>(Color::BLUE);
    cout << "Color::BLUE as int: " << ci << "\n";

    // int back to enum
    Color fromInt = static_cast<Color>(0);
    cout << "0 as Color: " << colorName(fromInt) << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Underlying type — sizeof and range
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Underlying type ===\n";
    cout << "sizeof(Color)      : " << sizeof(Color) << " bytes\n"; // 4 (int)
    cout << "sizeof(Status)     : " << sizeof(Status) << " bytes\n"; // 1 (uint8_t)
    cout << "sizeof(HttpStatus) : " << sizeof(HttpStatus) << " bytes\n"; // 2 (uint16_t)
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Explicit values
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Explicit values ===\n";
    HttpStatus code = HttpStatus::NOT_FOUND;
    cout << "HTTP 404 value: " << static_cast<uint16_t>(code) << "\n";
    cout << "HTTP 200 value: " << static_cast<uint16_t>(HttpStatus::OK) << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Switch on enum class — exhaustive warning if a case is missing
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Switch on enum class ===\n";
    Status s = Status::WARNING;
    switch (s) {
        case Status::OK: cout << "All good\n";
            break;
        case Status::WARNING: cout << "Check system\n";
            break;
        case Status::ERROR: cout << "Critical error\n";
            break;
            // no default — compiler warns if a new Status enumerator is added
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Bitflag enum class
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Bitflag enum class ===\n";
    Perm userPerm = Perm::READ | Perm::WRITE;

    cout << "READ  : " << hasFlag(userPerm, Perm::READ) << "\n"; // 1
    cout << "WRITE : " << hasFlag(userPerm, Perm::WRITE) << "\n"; // 1
    cout << "EXEC  : " << hasFlag(userPerm, Perm::EXEC) << "\n"; // 0

    Perm rawVal = static_cast<Perm>(static_cast<uint8_t>(userPerm));
    cout << "raw uint8 value: " << static_cast<int>(rawVal) << "\n\n"; // 3 (1|2)

    // ─────────────────────────────────────────────────────────────────────────
    // Enum in array — using underlying type to iterate
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Iterating enum values ===\n";
    // C++ has no built-in enum iteration — common patterns:
    // 1. Add a COUNT sentinel enumerator
    enum class Season { SPRING = 0, SUMMER, AUTUMN, WINTER, COUNT };
    for (int i = 0; i < static_cast<int>(Season::COUNT); i++) {
        cout << "Season " << i << "\n";
    }
    cout << "\n";

    // 2. Array of all values (explicit, most portable)
    const Color colors[] = {Color::RED, Color::GREEN, Color::BLUE};
    for (const Color &col: colors) {
        cout << colorName(col) << "\n";
    }

    return 0;
}
