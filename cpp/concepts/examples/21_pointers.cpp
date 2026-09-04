// =============================================================================
// pointers.cpp — The Complete Pointer Reference
// =============================================================================
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 1 — WHAT IS A POINTER
// ─────────────────────────────────────────────────────────────────────────
//
//   A pointer is a variable that stores a MEMORY ADDRESS.
//   It does not hold a plain value — it holds WHERE a value lives.
//
//   int  number  = 10;       — variable: stores the value 10
//   int* pointer = &number;  — pointer:  stores the address of number
//
//   A pointer IS itself a variable — it lives in memory, has its own address,
//   and occupies 8 bytes on a 64-bit system (regardless of what it points to).
//
//   Stack layout:
//     address     │ name    │ value
//     ────────────┼─────────┼───────────────────────
//     0x7ffd0010  │ number  │ 10
//     0x7ffd0018  │ pointer │ 0x7ffd0010  ──► points to number
//
//   Three distinct things:
//     &pointer  — address of the pointer variable itself  (0x7ffd0018)
//     pointer   — address the pointer holds               (0x7ffd0010)
//     *pointer  — value at that address                   (10)
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 2 — DECLARING POINTERS
// ─────────────────────────────────────────────────────────────────────────
//
//   int* p;      — p is a pointer to int (preferred: type carries the *)
//   int *p;      — identical, some prefer * near the name
//   int* a, b;   — TRAP: only a is a pointer, b is a plain int
//   int *a, *b;  — both are pointers
//
//   THE BOOK SAYS: int *ptr; *ptr = 5; is syntactically valid.
//   THIS IS TRUE — it compiles without error.
//   BUT IT IS CATASTROPHICALLY DANGEROUS.
//
//   ptr is declared but never initialized. It holds whatever bytes
//   happened to be on the stack at that location — a garbage address.
//   Writing *ptr = 5 sends the value 5 to that garbage address.
//   You are writing into a random memory location you do not own.
//   The program may crash immediately, crash later in an unrelated place,
//   silently corrupt data, or appear to work and fail only in production.
//
//   "Syntactically valid" does NOT mean "safe to run".
//   ALWAYS initialize pointers at the point of declaration.
//
//   SAFE FORMS:
//     int* p = nullptr;       — explicitly points to nothing, detectable
//     int* p = &someVar;      — points to an existing variable
//     int* p = new int(0);    — points to fresh heap memory
//     int* p = arr;           — points to first element of an array
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 3 — ASSIGNING VALUES TO POINTERS
// ─────────────────────────────────────────────────────────────────────────
//
//   Two completely different operations — easy to confuse:
//
//   ptr = &x;    — assign an ADDRESS to the pointer (reseat the pointer)
//                  ptr now points to x
//
//   *ptr = 5;    — assign a VALUE through the pointer (write to pointed-to memory)
//                  changes the value at the address ptr holds
//
//   int x = 10, y = 20;
//   int* p = &x;   // p points to x
//   p  = &y;       // p now points to y  — reseat
//   *p = 99;       // y is now 99        — write through
//
//   Assigning a pointer variable (p = ...) changes WHERE it points.
//   Dereferencing and assigning (*p = ...) changes WHAT it points to.
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 4 — DEREFERENCING POINTERS
// ─────────────────────────────────────────────────────────────────────────
//
//   The dereference operator * follows the pointer to the memory it points to.
//
//   int x = 10;
//   int* p = &x;
//   *p         — reads the int stored at p's address  → 10
//   *p = 20;   — writes 20 to that address → x is now 20
//
//   STRUCT/CLASS member access through pointer:
//     (*ptr).member  — dereference then access (verbose)
//     ptr->member    — arrow operator, identical but idiomatic
//
//   POINTER TO POINTER:
//     int** pp = &p;   — pp holds the address of p
//     *pp  == p        — the address of x
//     **pp == x        — the value 10 (follow twice)
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 5 — POINTER VS POINTED-TO VALUE
// ─────────────────────────────────────────────────────────────────────────
//
//   int x = 10;
//   int* p = &x;
//
//   p          — the pointer variable         → holds 0x7ffd0010 (an address)
//   *p         — the pointed-to value         → 10
//   &p         — address of the pointer itself→ 0x7ffd0018
//   &x         — address of x                 → 0x7ffd0010  (same as p)
//   sizeof(p)  — size of the pointer          → 8 bytes (always, 64-bit)
//   sizeof(*p) — size of the pointed-to type  → 4 bytes (int)
//   sizeof(x)  — size of x                    → 4 bytes (int)
//
//   p == &x    → true   (p stores x's address)
//   *p == x    → true   (both are 10)
//   &p == &x   → false  (p and x live at different addresses)
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 6 — POINTER ARITHMETIC
// ─────────────────────────────────────────────────────────────────────────
//
//   Adding or subtracting an integer from a pointer scales by sizeof(type).
//   This is NOT a byte offset — it is an ELEMENT offset.
//
//   int arr[5] = {10,20,30,40,50};
//   int* p = arr;   // p → arr[0] at e.g. 0x1000
//
//   p + 1  →  0x1004  (moved 4 bytes = sizeof(int))  →  arr[1]
//   p + 2  →  0x1008  (moved 8 bytes)                →  arr[2]
//   p + n  →  address of arr[n]
//
//   Formula: (p + n) == base_address + (n * sizeof(*p))
//
//   OPERATIONS:
//     p + n       advance n elements (does NOT modify p)
//     p - n       move back n elements
//     p++         post-increment: returns old p, then advances
//     ++p         pre-increment: advances, then returns new p
//     p += n      advance p in-place
//     p - q       number of ELEMENTS between two pointers (type: ptrdiff_t)
//     p[n]        syntactic sugar for *(p+n) — identical result
//
//   TYPE DETERMINES STEP SIZE:
//     char*   +1  →  1 byte
//     int*    +1  →  4 bytes
//     double* +1  →  8 bytes
//
//   VALID RANGE:
//     p+0 to p+N   valid (p+N is one-past-end, only for comparison, NOT dereference)
//     *(p+N)       UB — one-past-end cannot be dereferenced
//     p+N+1        UB — outside array
//     p-1          UB — before array start
//
//   INCREMENT VARIANTS — all different:
//     *p++    dereference p, THEN advance p  (reads current, moves to next)
//     *++p    advance p FIRST, THEN dereference (skips one element)
//     (*p)++  increment the VALUE at *p, pointer unchanged
//     *(p++)  same as *p++ (explicit parentheses)
//
//   SUBTRACTION:
//     int* a = &arr[1]; int* b = &arr[4];
//     b - a == 3   (elements, not bytes)
//     Result type is ptrdiff_t — always use this, not int
//     Only valid between pointers into the SAME array — else UB
//
//   void* ARITHMETIC:
//     Not allowed — void has no size.
//     Cast to char* for byte-level arithmetic.
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 7 — STATIC BINDING vs DYNAMIC BINDING FOR ARRAYS
// ─────────────────────────────────────────────────────────────────────────
//
//   STATIC BINDING (compile-time, stack):
//     int arr[5] = {1,2,3,4,5};
//     - Size fixed at compile time — cannot change
//     - Memory allocated on the stack automatically
//     - sizeof(arr) == 20 (full array size, not pointer size)
//     - Freed automatically when scope exits
//     - arr name decays to int* when passed to functions (size info lost)
//
//   DYNAMIC BINDING (runtime, heap):
//     int n = getSize();              // size known only at runtime
//     int* arr = new int[n];          // allocated on heap
//     - Size determined at runtime
//     - sizeof(arr) == 8 (pointer size only — size information is GONE)
//     - YOU must free: delete[] arr;
//     - Survives scope exit until explicitly deleted
//     - Pointer can be reseated to a different array
//
//   WHY THIS MATTERS:
//     Static:  int arr[5];    sizeof(arr) == 20   — compiler knows full size
//     Dynamic: int* p = arr;  sizeof(p)   ==  8   — only pointer size, size lost
//     Always pass size as a separate parameter when using raw pointers.
//     Use std::vector for dynamic arrays — it remembers its own size.
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 8 — ARRAY NOTATION vs POINTER NOTATION
// ─────────────────────────────────────────────────────────────────────────
//
//   Array notation and pointer notation are interchangeable — the compiler
//   converts one to the other. There is NO runtime difference.
//
//     int arr[5] = {10,20,30,40,50};
//     int* p = arr;
//
//     arr[2]    ==  *(arr + 2)  ==  p[2]    ==  *(p + 2)   →  30
//     &arr[2]   ==  arr + 2     ==  &p[2]   ==  p + 2      →  address of element 2
//
//   arr[i] is DEFINED as *(arr + i) by the C/C++ standard.
//   p[i]   is DEFINED as *(p   + i).
//   They are literally the same expression after compilation.
//
//   DIFFERENCE between arr and p:
//     arr  — fixed, cannot be reseated (arr = p is illegal)
//            sizeof(arr) == full array size
//     p    — pointer variable, can be reseated (p = arr+2 is fine)
//            sizeof(p)   == 8 (pointer size)
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 9 — POINTERS AND STRINGS
// ─────────────────────────────────────────────────────────────────────────
//
//   C-style strings are null-terminated char arrays.
//   Pointers and strings interact in three distinct ways:
//
//   1. POINTER TO STRING LITERAL (read-only):
//        const char* s = "Hello";
//        - "Hello" lives in the read-only .rodata segment of the binary
//        - s points directly to that memory — no copy is made
//        - s[0] = 'X' is UB — the memory is read-only
//        - s can be reseated: s = "World"; is fine
//        - sizeof(s) == 8 (pointer), strlen(s) == 5
//
//   2. CHAR ARRAY (mutable copy):
//        char s[] = "Hello";
//        - Compiler copies "Hello" into a stack array
//        - Mutable: s[0] = 'X' is fine
//        - sizeof(s) == 6 (5 chars + '\0')
//        - Cannot be reseated — it is an array, not a pointer
//
//   3. HEAP STRING:
//        char* s = new char[]{"Hello"};
//        - Mutable copy on the heap
//        - Must be freed with delete[] s (NOT delete)
//        - sizeof(s) == 8 (pointer size only)
//
//   cout AND char*:
//     cout treats char* as a C-string and prints the characters until '\0'.
//     To print the ADDRESS of a char*, cast to void*:
//       cout << (void*)s;   — prints address, not string content
//
//   POINTER WALKING A STRING:
//     const char* p = "Hello";
//     while (*p) { cout << *p; p++; }   // advance until null terminator
//     while (*p++) { ... }               // same, compact form
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 10 — DANGERS
// ─────────────────────────────────────────────────────────────────────────
//
//   1. UNINITIALIZED POINTER — "never-never land"
//      int* p; *p = 5;
//      p holds garbage — you write to a random address you do not own.
//      May crash now, may corrupt data silently, may crash much later elsewhere.
//
//   2. DANGLING POINTER — freed or out-of-scope memory
//      int* p = new int(10); delete p; *p = 5;  // UB — memory is gone
//      int* fn() { int x = 5; return &x; }      // UB — x destroyed on return
//
//   3. NULL DEREFERENCE
//      int* p = nullptr; *p = 10;  // segfault — address 0x0 is always unmapped
//
//   4. DOUBLE FREE
//      delete p; delete p;  // UB — heap corruption, allocator crash
//
//   5. BUFFER OVERRUN
//      int arr[5]; int* p = arr; *(p+10) = 99;  // UB — corrupts adjacent memory
//
//   6. MISMATCHED delete
//      new T    → delete p      (single object)
//      new T[n] → delete[] p    (array — MUST have brackets)
//      Mixing is UB.
//
// ─────────────────────────────────────────────────────────────────────────
//   SECTION 11 — RULES AND BEST PRACTICES
// ─────────────────────────────────────────────────────────────────────────
//
//   1.  ALWAYS initialize on declaration
//         int* p = nullptr;     — safe null state
//         int* p = &var;        — point to something real
//         int* p = new int(0);  — heap allocation
//         int* p;               — NEVER, garbage address
//
//   2.  CHECK before dereferencing
//         if (p != nullptr) { *p = 10; }
//
//   3.  MATCH new/delete forms
//         new T    → delete p
//         new T[n] → delete[] p
//
//   4.  nullptr AFTER delete
//         delete p; p = nullptr;
//         Makes double-delete a no-op. Turns silent UB into a loud crash.
//
//   5.  NEVER return pointer to a local variable
//         int* bad() { int x = 5; return &x; }  // x is gone on return
//
//   6.  NO arithmetic past array bounds
//         p+N is one-past-end — compute only, never dereference
//         p+N+1 or p-1 is UB
//
//   7.  USE const to communicate intent
//         const int* p       — data read-only, pointer reseatable
//         int* const p       — pointer fixed, data mutable
//         const int* const p — both fixed
//
//   8.  PREFER references over pointers (C++) when non-null is guaranteed
//         References cannot be null, cannot be reseated, no dereference syntax.
//
//   9.  PREFER smart pointers for ownership (modern C++)
//         unique_ptr<T> — single owner, auto-deleted, zero overhead
//         shared_ptr<T> — shared ownership, reference-counted
//         Eliminates rules 3, 4, 5 automatically.
//
//   10. USE tools to catch pointer bugs
//         AddressSanitizer:  -fsanitize=address   (GCC/Clang)
//         UBSanitizer:       -fsanitize=undefined
//         Valgrind:          valgrind ./program
//         clang-tidy / cppcheck: static analysis
//
// =============================================================================

#include <iostream>
#include <cstring>   // strlen, strcpy
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 2 — DECLARING POINTERS
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Declaring Pointers ===\n";

    int x = 42;
    int *p1 = &x; // point to existing variable — safe
    int *p2 = new int(7); // heap allocation — safe, must delete
    int *p3 = nullptr; // explicitly nothing — safe
    // int* bad;             // NEVER — holds garbage, writing through it is UB
    // int* bad; *bad = 5;   // SYNTACTICALLY VALID — SEMANTICALLY CATASTROPHIC

    cout << "p1 (stack)  : " << *p1 << "\n";
    cout << "p2 (heap)   : " << *p2 << "\n";
    cout << "p3 is null  : " << (p3 == nullptr ? "yes" : "no") << "\n\n";
    delete p2;
    p2 = nullptr;

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 3 — ASSIGNING VALUES TO POINTERS
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Assigning Values ===\n";

    int a = 10, b = 20;
    int *p = &a;
    cout << "p = &a  →  *p = " << *p << "\n"; // 10

    p = &b; // RESEAT pointer — p now points to b
    cout << "p = &b  →  *p = " << *p << "\n"; // 20

    *p = 99; // WRITE THROUGH pointer — b is now 99
    cout << "*p = 99 →  b  = " << b << "\n\n"; // 99

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 4 — DEREFERENCING POINTERS
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Dereferencing ===\n";

    int val = 10;
    int *ptr = &val;

    cout << "ptr      (address)  : " << ptr << "\n";
    cout << "*ptr     (value)    : " << *ptr << "\n"; // 10
    *ptr = 50;
    cout << "after *ptr = 50     : val = " << val << "\n\n"; // 50

    // pointer-to-pointer
    int **pp = &ptr;
    cout << "**pp (follow twice) : " << **pp << "\n\n"; // 50

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 5 — POINTER vs POINTED-TO VALUE
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Pointer vs Pointed-to Value ===\n";

    int n = 10;
    int *np = &n;

    cout << "np         (address of n)  : " << np << "\n";
    cout << "*np        (value of n)    : " << *np << "\n"; // 10
    cout << "&np        (address of ptr): " << &np << "\n";
    cout << "np == &n   : " << (np == &n ? "true" : "false") << "\n"; // true
    cout << "*np == n   : " << (*np == n ? "true" : "false") << "\n"; // true
    cout << "&np != &n  : different types (int** vs int*), not comparable\n";
    cout << "  &np address: " << (void *) &np << "  (where the pointer var lives)\n";
    cout << "  &n  address: " << (void *) &n << "  (where the int lives)\n";
    cout << "sizeof(np) : " << sizeof(np) << " bytes (pointer)\n"; // 8
    cout << "sizeof(*np): " << sizeof(*np) << " bytes (int)\n\n"; // 4

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 6 — POINTER ARITHMETIC
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Pointer Arithmetic ===\n";

    int arr[5] = {10, 20, 30, 40, 50};
    int *ap = arr;

    cout << "arr[0] via *(ap+0): " << *(ap + 0) << "  addr: " << (ap + 0) << "\n";
    cout << "arr[1] via *(ap+1): " << *(ap + 1) << "  addr: " << (ap + 1) << "\n";
    cout << "arr[2] via *(ap+2): " << *(ap + 2) << "  addr: " << (ap + 2) << "\n";
    cout << "byte gap +1 : " << (char *) (ap + 1) - (char *) (ap) << " bytes\n\n";

    // type affects step size
    double darr[3] = {1.1, 2.2, 3.3};
    double *dp = darr;
    cout << "double* +1 gap : " << (char *) (dp + 1) - (char *) dp << " bytes\n";
    char carr[] = "ABC";
    char *cp = carr;
    cout << "char*   +1 gap : " << (char *) (cp + 1) - (char *) cp << " byte\n\n";

    // increment variants
    cout << "--- Increment Variants ---\n";
    int vals[4] = {100, 200, 300, 400};
    int *ip = vals;
    cout << "*ip++  = " << *ip++ << "  (read THEN advance) → ip now at vals[1]\n";
    cout << "*ip    = " << *ip << "\n\n";

    ip = vals;
    cout << "*++ip  = " << *++ip << "  (advance THEN read)  → skipped vals[0]\n\n";

    ip = vals;
    cout << "(*ip)++: before=" << *ip;
    (*ip)++;
    cout << "  after=" << *ip << "  (value changed, pointer unchanged)\n\n";

    // iteration with pointer
    cout << "--- Iterate with pointer ---\n";
    for (int *it = arr; it != arr + 5; it++) {
        cout << *it << " ";
    }
    cout << "\n\n";

    // pointer subtraction
    int *pa = &arr[1];
    int *pb = &arr[4];
    ptrdiff_t diff = pb - pa;
    cout << "pb - pa = " << diff << " elements  ("
            << (char *) pb - (char *) pa << " bytes)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 7 — STATIC vs DYNAMIC BINDING
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Static vs Dynamic Binding ===\n";

    // static — size known at compile time, stack
    int staticArr[5] = {1, 2, 3, 4, 5};
    cout << "sizeof(staticArr) = " << sizeof(staticArr) << " bytes (full array)\n";

    // dynamic — size at runtime, heap
    int size = 5;
    int *dynArr = new int[size]{1, 2, 3, 4, 5};
    cout << "sizeof(dynArr)    = " << sizeof(dynArr) << " bytes (pointer only)\n";
    cout << "dynamic arr[2]    = " << dynArr[2] << "\n\n";
    delete[] dynArr;
    dynArr = nullptr;

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 8 — ARRAY NOTATION vs POINTER NOTATION
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Array vs Pointer Notation ===\n";

    int nums[5] = {10, 20, 30, 40, 50};
    int *np2 = nums;

    // all four expressions are identical
    cout << "arr[2]     = " << nums[2] << "\n"; // 30
    cout << "*(arr+2)   = " << *(nums + 2) << "\n"; // 30
    cout << "p[2]       = " << np2[2] << "\n"; // 30
    cout << "*(p+2)     = " << *(np2 + 2) << "\n"; // 30

    cout << "&arr[2] == arr+2 : "
            << (&nums[2] == nums + 2 ? "true" : "false") << "\n"; // true

    // sizeof difference
    cout << "sizeof(nums) = " << sizeof(nums) << " (full array)\n"; // 20
    cout << "sizeof(np2)  = " << sizeof(np2) << " (pointer)\n\n"; // 8

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 9 — POINTERS AND STRINGS
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Pointers and Strings ===\n";

    // 1. pointer to string literal — read-only
    const char *lit = "Hello";
    cout << "literal       : " << lit << "\n"; // Hello
    cout << "address       : " << (void *) lit << "\n"; // .rodata address
    cout << "sizeof(lit)   : " << sizeof(lit) << "\n"; // 8 (pointer)
    cout << "strlen(lit)   : " << strlen(lit) << "\n"; // 5
    lit = "World"; // reseat — OK
    cout << "after reseat  : " << lit << "\n\n";
    // lit[0] = 'X';  // UB — read-only memory

    // 2. char array — mutable copy
    char mutable_s[] = "Hello";
    mutable_s[0] = 'J';
    cout << "mutable array : " << mutable_s << "\n"; // Jello
    cout << "sizeof        : " << sizeof(mutable_s) << "\n\n"; // 6 (5+'\0')

    // 3. heap string
    char *heapStr = new char[]{"Hello"};
    heapStr[0] = 'M';
    cout << "heap string   : " << heapStr << "\n\n"; // Mello
    delete[] heapStr;
    heapStr = nullptr;

    // printing address of char* — must cast to void*
    const char *s = "test";
    cout << "char*  cout   : " << s << "\n"; // test (string)
    cout << "void*  cout   : " << (void *) s << "\n\n"; // address

    // pointer walking a string
    cout << "--- Walking a string ---\n";
    const char *walk = "Hello";
    while (*walk) {
        cout << *walk;
        walk++; // advance to next char
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 10/11 — DANGERS DEMO (safe versions shown)
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Dangers Demo (safe versions) ===\n";

    // uninitialized — WRONG:  long* p; *p = 223323;
    // CORRECT:
    long lval = 223323;
    long *lp = &lval;
    *lp = 223323;
    cout << "safe uninitialized fix: " << *lp << "\n";

    // dangling — WRONG: delete p; *p = 5;
    // CORRECT:
    int *dp2 = new int(10);
    delete dp2;
    dp2 = nullptr; // nullptr after delete
    if (dp2) *dp2 = 5; // guard — never reached
    cout << "safe dangling fix: " << (dp2 == nullptr ? "null (safe)" : "oops") << "\n";

    return 0;
}
