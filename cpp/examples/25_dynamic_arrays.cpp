// =============================================================================
// dynamic_arrays.cpp — Heap Arrays, std::array, and std::vector
// =============================================================================
//
// THREE WAYS TO STORE A SEQUENCE IN C++:
//
//   1. Built-in array (C-style)     int arr[5]        — stack, fixed, no bounds check
//   2. std::array<T, N>             array<int, 5>     — stack, fixed, safe, modern
//   3. std::vector<T>               vector<int>       — heap, dynamic, safe, preferred
//
// ── 1. HEAP ARRAY (new / delete[]) ──────────────────────────────────────────
//
//   int* p = new int[N];        — allocates N ints on the heap
//   int* p = new int[N]{...};   — allocate + initialize (C++11)
//   delete[] p;                 — MUST match new[] exactly
//   p = nullptr;                — prevent dangling pointer after free
//
//   USE WHEN: interfacing with C APIs, embedded/no-STL environments, or implementing your own container internals.
//   AVOID in general application code — prefer vector instead.
//
//   OWNERSHIP AND ALIASING:
//     int* a = new int[3]{1,2,3};
//     int* b = a;          — b is an alias, NOT a copy — both point to same heap block
//     delete[] a;
//     delete[] b;          — DOUBLE FREE — UB, crash
//     b = a;  then a = ...; — original block now only referenced by b (track with temp)
//
//   RULES:
//     new[]   → delete[]   always — never delete (no brackets) on array allocation
//     delete twice          → UB (usually crashes, heap corruption)
//     use after delete      → UB (dangling pointer — reads garbage or crashes)
//     always set nullptr after delete to make dangling pointer detectable
//
// ── 2. std::array<T, N> ─────────────────────────────────────────────────────
//
//   #include <array>
//   array<int, 5> a = {1, 2, 3, 4, 5};
//
//   Fixed size, stack-allocated, zero overhead vs C array.
//   Size is part of the TYPE — array<int,5> and array<int,6> are different types.
//   Bounds-checked access: a.at(i) throws std::out_of_range; a[i] does not check.
//   Knows its own size: a.size() — unlike raw arrays that decay and lose size info.
//   Copyable and assignable — raw arrays are not.
//   USE WHEN: size is known at compile time and heap allocation is undesirable.
//
// ── 3. std::vector<T> ───────────────────────────────────────────────────────
//
//   #include <vector>
//   vector<int> v = {1, 2, 3};
//
//   Heap-allocated, resizable, contiguous memory.
//   Manages memory automatically — no new/delete, no leaks.
//   Grows dynamically: push_back(), emplace_back().
//   Capacity doubles on reallocation — amortized O(1) appends.
//
//   KEY MEMBERS:
//     v.size()         — current number of elements
//     v.capacity()     — allocated slots (>= size)
//     v.push_back(x)   — append, may reallocate
//     v.emplace_back(x)— construct in-place, slightly more efficient
//     v.pop_back()     — remove last element
//     v.at(i)          — bounds-checked access
//     v[i]             — unchecked access
//     v.reserve(n)     — pre-allocate n slots, avoids reallocation in loops
//     v.resize(n)      — change size (fills new slots with zero/default)
//     v.clear()        — remove all elements (capacity unchanged)
//     v.empty()        — true if size() == 0
//     v.data()         — raw pointer to underlying array (for C interop)
//     v.front()/back() — first/last element
//
//   REALLOCATION INVALIDATES POINTERS/ITERATORS:
//     If push_back triggers reallocation, any pointer/reference/iterator
//     into the vector becomes dangling. Use indices, not pointers, if you
//     intend to keep appending.
//
//   USE WHEN: size is unknown at compile time, or you need to grow/shrink.
//   DEFAULT CHOICE — reach for vector first, deviate with reason.
//
// COMPARISON SUMMARY:
//   Feature              | int[]      | array<T,N> | vector<T>
//   ---------------------|------------|------------|----------
//   Location             | stack      | stack      | heap
//   Size at compile time | required   | required   | not needed
//   Resize at runtime    | no         | no         | yes
//   Bounds checking      | no         | .at() only | .at() only
//   Knows its own size   | no (decays)| yes        | yes
//   Copy/assign          | no         | yes        | yes
//   Manual memory mgmt   | no         | no         | no
//   C API compatible     | yes        | .data()    | .data()
//
// =============================================================================

#include <iostream>
#include <array>
#include <vector>
using namespace std;

void printRaw(int arr[], int n) {
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << "\n";
}

int main() {
    constexpr int N = 3;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Heap array — new[], manual ownership
    // ─────────────────────────────────────────────────────────────────────────
    int *p1 = new int[N]; // uninitialized
    p1[0] = 1;
    p1[1] = 2;
    p1[2] = 3;
    printRaw(p1, N);

    int *p2 = new int[N]{3, 2, 1}; // allocate + initialize
    printRaw(p2, N);

    // Aliasing — p3 is NOT a copy, it points to the same block as p2
    int *pTemp = p2; // save original address before reseating
    p2 = p1; // p2 now points to p1's block; p1's block has two owners
    *p1 = 10;
    cout << "*p1: " << *p1 << "  *p2: " << *p2 << "\n"; // both 10 — same block

    *p2 = 99;
    cout << "*p1: " << *p1 << "  *p2: " << *p2 << "\n"; // both 99 — same block

    delete[] p1; // free p1's block (p2 aliases it — don't delete p2 separately)
    p1 = nullptr;
    p2 = nullptr; // p2 aliased p1's block — it's freed, null it to prevent use

    delete[] pTemp; // free the original p2 block (saved before reseating)
    pTemp = nullptr;
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 2. std::array — fixed size, stack, safe, copyable
    // ─────────────────────────────────────────────────────────────────────────
    array<int, N> arr = {10, 20, 30};

    cout << "array size    : " << arr.size() << "\n";
    cout << "array[1]      : " << arr[1] << "\n"; // unchecked
    cout << "array.at(1)   : " << arr.at(1) << "\n"; // bounds-checked
    // arr.at(99);                                       // throws std::out_of_range

    array<int, N> arrCopy = arr; // copy works — raw arrays can't do this
    arrCopy[0] = 999;
    cout << "original[0]   : " << arr[0] << "\n"; // 10 — unaffected
    cout << "copy[0]       : " << arrCopy[0] << "\n\n"; // 999

    // ─────────────────────────────────────────────────────────────────────────
    // 3. std::vector — dynamic, heap, preferred default
    // ─────────────────────────────────────────────────────────────────────────
    vector<int> v = {1, 2, 3};

    v.push_back(4);
    v.push_back(5);

    cout << "vector size    : " << v.size() << "\n";
    cout << "vector capacity: " << v.capacity() << "\n"; // >= size, grows as needed

    cout << "elements: ";
    for (const auto &x: v) cout << x << " ";
    cout << "\n\n";

    // reserve to avoid reallocation when size is known upfront
    vector<int> v2;
    v2.reserve(10); // allocate 10 slots — no reallocation during the next 10 push_backs
    for (int i = 0; i < 10; i++) v2.push_back(i);
    cout << "v2 size/capacity: " << v2.size() << "/" << v2.capacity() << "\n";

    // data() — raw pointer for C API interop
    int *raw = v.data();
    cout << "v.data()[0]    : " << raw[0] << "\n";

    return 0;
}
