// =============================================================================
// unions.cpp — Unions: Memory Sharing, Tagged Unions, and std::variant
// =============================================================================
//
// WHAT IS A UNION:
//   A union is a special data structure where ALL members share the same memory
//   location. The size of a union equals the size of its LARGEST member.
//   Only ONE member can hold a valid value at any given time.
//   Writing to one member and reading from another is undefined behavior in C++
//   (with one exception: common initial sequence in standard-layout structs).
//
//   struct S { int i; double d; };  — sizeof = 12 (4 + 8, with padding)
//   union  U { int i; double d; };  — sizeof = 8  (only the largest member)
//
//   All members start at the same address:
//     union U { int i; double d; };
//     U u;
//     &u == (void*)&u.i == (void*)&u.d  — all three are the same address
//
// DECLARATION AND ACCESS:
//   union Data {
//       int    i;
//       float  f;
//       char   c;
//   };
//   Data d;
//   d.i = 42;       — write int member
//   d.f = 3.14f;    — write float — i is now INVALID, reading it is UB
//   cout << d.f;    — OK: reading the last-written member
//   cout << d.i;    — UB: i was not the last written member
//
// WHEN TO USE UNIONS:
//   - Memory-constrained environments (embedded, network packets)
//   - Hardware register access — same bytes interpreted as different types
//   - Type punning (with caveats — see below)
//   - Building a tagged/discriminated union (see below)
//   In modern C++ prefer std::variant over raw unions for type safety.
//
// TAGGED UNION (DISCRIMINATED UNION):
//   A raw union has no way to know which member is currently active.
//   Wrap it in a struct with a "tag" (enum) that tracks which member is valid:
//
//     enum class Tag { INT, FLOAT, TEXT };
//     struct Value {
//         Tag tag;
//         union {
//             int         i;
//             float       f;
//             const char* s;
//         };
//     };
//
//   Always check the tag before reading a member.
//   This is exactly what std::variant does — safely and automatically.
//
// ANONYMOUS UNIONS:
//   A union without a name declared inside a struct — members are accessed
//   directly as members of the enclosing struct:
//     struct Packet {
//         int type;
//         union {       // anonymous
//             int   iVal;
//             float fVal;
//         };
//     };
//     Packet p;
//     p.iVal = 10;     // no union name needed
//
// TYPE PUNNING — reading one type's bytes as another type:
//   union FloatBits { float f; uint32_t bits; };
//   FloatBits fb; fb.f = 1.0f;
//   cout << hex << fb.bits;   // inspect raw IEEE 754 bits of the float
//   C++ standard technically makes this UB (strict aliasing rule).
//   GCC/Clang support it as an extension. The portable alternative is memcpy:
//     uint32_t bits;
//     memcpy(&bits, &f, sizeof(f));  // well-defined, compiler optimizes to zero cost
//
// UNIONS WITH NON-TRIVIAL MEMBERS:
//   If any member has a non-trivial constructor/destructor (e.g. std::string),
//   the union's special members are DELETED by default.
//   You must manually define them and use placement new / explicit destructor calls:
//     union U {
//         std::string s;
//         int         i;
//         U()  {}   // must define
//         ~U() {}   // must define — won't auto-destroy s
//     };
//     U u;
//     new (&u.s) std::string("hello");  // construct string in union memory
//     u.s.~basic_string();              // manually destroy before switching member
//   This complexity is the main reason std::variant exists.
//
// UNIONS vs STRUCT vs std::variant:
//   Feature              | union       | struct      | std::variant
//   ---------------------|-------------|-------------|------------------
//   Members share memory | YES         | NO          | YES
//   Tracks active type   | NO (manual) | N/A         | YES (automatic)
//   Non-trivial members  | Manual      | Automatic   | Automatic
//   Type-safe access     | NO          | N/A         | YES
//   sizeof               | largest     | sum+padding | largest+overhead
//   C compatible         | YES         | YES         | NO
//   Throws on wrong read | NO (UB)     | N/A         | YES (bad_variant_access)
//
// std::variant (C++17):
//   std::variant<int, float, string> v = 42;
//
//   get<T>(v)                  — access as T, throws std::bad_variant_access if wrong
//   get_if<T>(&v)              — returns T* or nullptr (no throw, prefer for checks)
//   holds_alternative<T>(v)    — returns bool: is T the active type?
//   visit(callable, v)         — call callable with the active member (type-safe dispatch)
//   v.index()                  — returns index (0, 1, 2...) of active type
//   v.valueless_by_exception() — true if variant is in invalid state after exception
//
// COMMON PITFALLS:
//   1. Reading inactive member         — UB, may return garbage or crash
//   2. Forgetting to manually destroy non-trivial members before switching
//   3. Using union for cross-platform serialization — layout is implementation-defined
//   4. Assuming union size == largest member — padding may make it larger
//   5. Storing address of union member  — strict aliasing rules apply
//   6. Using union instead of variant for non-trivial types — manual work, error-prone
//
// =============================================================================

#include <iostream>
#include <variant>
#include <string>
#include <cstring>
#include <cstdint>
using namespace std;

// ─────────────────────────────────────────────────────────────────────────
// Basic union — all members share the same memory address
// ─────────────────────────────────────────────────────────────────────────
union Data {
    int i;
    float f;
    double d;
};

// ─────────────────────────────────────────────────────────────────────────
// Tagged union — enum tracks which member is currently active
// ─────────────────────────────────────────────────────────────────────────
enum class ValueType { INT, FLOAT, TEXT };

struct Value {
    ValueType type;

    union {
        int i;
        float f;
        const char *s;
    };
};

void printValue(const Value &v) {
    switch (v.type) {
        case ValueType::INT: cout << "int:   " << v.i << "\n";
            break;
        case ValueType::FLOAT: cout << "float: " << v.f << "\n";
            break;
        case ValueType::TEXT: cout << "text:  " << v.s << "\n";
            break;
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Packet with anonymous union — members accessed directly on struct
// ─────────────────────────────────────────────────────────────────────────
struct Packet {
    int type;

    union {
        int iVal;
        float fVal;
    };
};

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Basic union — size and shared address
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Basic Union ===\n";
    cout << "sizeof(int)    : " << sizeof(int) << "\n";
    cout << "sizeof(float)  : " << sizeof(float) << "\n";
    cout << "sizeof(double) : " << sizeof(double) << "\n";
    cout << "sizeof(Data)   : " << sizeof(Data) << "\n"; // 8 — size of largest member
    cout << "\n";

    Data d;
    d.i = 42;
    cout << "wrote d.i = 42  →  d.i = " << d.i << "\n"; // 42 — valid

    d.f = 3.14f;
    cout << "wrote d.f = 3.14f  →  d.f = " << d.f << "\n"; // valid
    // d.i here is UB — f is now the active member

    d.d = 2.71828;
    cout << "wrote d.d = 2.71828  →  d.d = " << d.d << "\n\n"; // valid

    // All members share the same address
    cout << "&d (union)  : " << &d << "\n";
    cout << "&d.i        : " << (void *) &d.i << "\n"; // same
    cout << "&d.f        : " << (void *) &d.f << "\n"; // same
    cout << "&d.d        : " << (void *) &d.d << "\n\n"; // same

    // ─────────────────────────────────────────────────────────────────────────
    // Tagged union — tag prevents reading the wrong member
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Tagged Union ===\n";
    Value v1 = {ValueType::INT};
    v1.i = 100;
    Value v2 = {ValueType::FLOAT};
    v2.f = 2.71f;
    Value v3 = {ValueType::TEXT};
    v3.s = "hello";

    printValue(v1);
    printValue(v2);
    printValue(v3);
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Anonymous union — members accessed directly on the struct
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Anonymous Union ===\n";
    Packet p;
    p.type = 0;
    p.iVal = 255;
    cout << "type=" << p.type << "  iVal=" << p.iVal << "\n";

    p.type = 1;
    p.fVal = 1.5f; // iVal is now invalid — fVal is active
    cout << "type=" << p.type << "  fVal=" << p.fVal << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Type punning via memcpy — well-defined, zero runtime cost
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Type Punning (memcpy) ===\n";
    float f = 1.0f;
    uint32_t bits = 0;
    memcpy(&bits, &f, sizeof(f));
    cout << "1.0f as IEEE 754 hex: 0x" << hex << bits << dec << "\n"; // 0x3f800000
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // std::variant — type-safe, auto-tracking, no manual tag needed
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== std::variant ===\n";
    variant<int, float, string> var = 42;

    cout << "active index : " << var.index() << "\n"; // 0 = int
    cout << "holds int?   : " << holds_alternative<int>(var) << "\n"; // 1
    cout << "value        : " << get<int>(var) << "\n\n";

    var = 3.14f;
    cout << "after var = 3.14f:\n";
    cout << "active index : " << var.index() << "\n"; // 1 = float
    cout << "value        : " << get<float>(var) << "\n\n";

    var = string("hello variant");
    cout << "after var = string:\n";
    cout << "value        : " << get<string>(var) << "\n\n";

    // get_if — returns pointer, nullptr if wrong type, no exception
    if (auto *ip = get_if<int>(&var)) {
        cout << "int: " << *ip << "\n";
    } else {
        cout << "get_if<int> returned nullptr (string is active)\n\n";
    }

    // visit — type-safe dispatch, callable invoked with active type
    cout << "=== std::visit ===\n";
    auto printer = [](const auto &val) {
        cout << "visiting: " << val << "\n";
    };

    var = 99;
    visit(printer, var);
    var = 2.71f;
    visit(printer, var);
    var = string("!");
    visit(printer, var);
    cout << "\n";

    // bad_variant_access — thrown when get<T> is called with wrong type
    cout << "=== bad_variant_access ===\n";
    var = 42;
    try {
        cout << get<float>(var); // var holds int, not float — throws
    } catch (const bad_variant_access &e) {
        cout << "caught: " << e.what() << "\n";
        cout << "use get_if or holds_alternative to check before get\n";
    }

    return 0;
}
