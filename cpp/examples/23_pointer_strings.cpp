// =============================================================================
// pointer_strings.cpp — Pointers and C-Style Strings
// =============================================================================
//
// THREE WAYS TO STORE A C-STYLE STRING:
//
//   ── 1. char array (mutable, stack) ──────────────────────────────────────────
//     char s[] = "Johnny Cage";
//
//     - compiler allocates a char array on the stack and COPIES the literal into it
//     - s is mutable — you can change individual characters: s[0] = 'X'
//     - s decays to char* when passed to functions
//     - freed automatically when scope exits
//     - sizeof(s) = 12 (11 chars + '\0')
//
//   ── 2. const char* pointing to a string literal (read-only, static) ─────────
//     const char* ps = "John Doe";
//
//     - "John Doe" is stored in the READ-ONLY data segment of the binary
//     - ps is a pointer that points directly to that read-only memory — NO copy
//     - writing through ps (ps[0] = 'X') is UB — likely a segfault
//     - the pointer ps itself can be reseated to point elsewhere: ps = "Other"
//     - the literal "John Doe" lives for the entire duration of the program
//     - sizeof(ps) = 8 (pointer size) — NOT the string length
//
//   ── 3. heap-allocated string (mutable, manual lifetime) ─────────────────────
//     const char* ps = new char[]{"TEST"};  // or: new char[5]{"TEST"}
//
//     - allocates a COPY of "TEST" on the heap
//     - mutable if accessed through char* (not const char*)
//     - must be freed with delete[] — NOT delete (it's an array)
//     - your code above uses delete (no brackets) — that is UB, always use delete[]
//
// STRING LITERAL STORAGE — KEY DETAIL:
//   String literals ("hello") are baked into the binary at compile time.
//   They live in a read-only segment (typically .rodata).
//   Multiple identical literals may share the same address (compiler-dependent).
//   Assigning const char* ps = "hello" does NOT allocate anything at runtime —
//   it just makes ps point at that pre-existing read-only memory.
//
// THE const IN const char*:
//   const char* ps  — pointer to const char: the CHARS are read-only, ps can be reseated
//   char* const ps  — const pointer to char: ps cannot be reseated, chars are mutable
//   const char* const ps — both read-only
//   Pointing a non-const char* at a string literal compiles but is dangerous:
//     char* bad = "hello";   // compiles with warning — writing through bad is UB
//     Always use const char* for string literals.
//
// RESEATING A POINTER:
//   const char* ps = "John Doe";
//   ps = "Jane Doe";   // OK — ps now points to a different literal, old one unaffected
//   ps = new char[]{"Heap"};  // OK — ps now points to heap memory (must delete[])
//   Switching between literal and heap ownership is a leak risk — track what ps points to.
//
// delete vs delete[] FOR STRINGS:
//   new char[]{"TEST"}  → delete[] ps    (array allocation — ALWAYS use delete[])
//   new char[]{"TEST"}  → delete ps      (UB — missing brackets, heap corruption)
//   String literals      → no delete     (read-only segment, not heap-allocated)
//   Stack char arrays    → no delete     (automatic storage, freed at scope exit)
//
// PREFER std::string IN MODERN C++:
//   std::string s = "Johnny Cage";   — manages memory, mutable, no manual delete
//   For read-only string parameters: use std::string_view (C++17) — zero copy,
//   works with std::string, const char*, and string literals alike.
//
// =============================================================================

#include <iostream>
#include <cstring>  // strlen
using namespace std;

int main() {
    //     =============================================================───────────────
    // 1. char array — stack copy, mutable
    //     =============================================================───────────────
    char s1[] = "Johnny Cage";
    cout << "char array     : " << s1 << "\n";
    cout << "sizeof(s1)     : " << sizeof(s1) << " bytes (includes \\0)\n";
    cout << "address        : " << (void *) s1 << "\n\n";

    s1[0] = 'T'; // mutable — OK
    cout << "after s1[0]='T': " << s1 << "\n\n";

    //     =============================================================───────────────
    // 2. const char* — points to read-only string literal, no allocation
    //     =============================================================───────────────
    const char *ps = "John Doe";
    cout << "string literal : " << ps << "\n";
    cout << "sizeof(ps)     : " << sizeof(ps) << " bytes (pointer size, not string length)\n";
    cout << "strlen(ps)     : " << strlen(ps) << " chars\n";
    cout << "address of lit : " << (void *) ps << "\n\n";

    // ps[0] = 'X';  // UB — literal lives in read-only memory, segfault

    // reseating ps — pointer changes, original literal is unaffected
    ps = "Jane Doe";
    cout << "after reseat   : " << ps << "\n\n";

    //     =============================================================───────────────
    // 3. heap string — allocated copy, must delete[]
    //     =============================================================───────────────
    char *heapStr = new char[]{"TEST"}; // non-const to allow mutation
    cout << "heap string    : " << heapStr << "\n";

    heapStr[0] = 'B'; // mutable — heap copy, safe to modify
    cout << "after mutation : " << heapStr << "\n";

    delete[] heapStr; // MUST be delete[] — new char[] is an array allocation
    heapStr = nullptr;
    cout << "\n";

    //     =============================================================───────────────
    // Showing all three addresses are different memory regions
    //     =============================================================───────────────
    char stack[] = "stack";
    const char *literal = "literal";
    char *heap = new char[]{"heap"};

    cout << "stack   addr: " << (void *) stack << "\n";
    cout << "literal addr: " << (void *) literal << "\n"; // .rodata segment — typically far from stack
    cout << "heap    addr: " << (void *) heap << "\n"; // heap — different region entirely

    delete[] heap;
    heap = nullptr;

    return 0;
}
