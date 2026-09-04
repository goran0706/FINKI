// =============================================================================
// heap_allocation.cpp — new / delete for Single Objects, Stack vs Heap
// =============================================================================
//
// TWO WAYS TO GET A POINTER TO AN INT:
//
//   ── Option A: point to an existing stack variable ──
//     int number = 10;
//     int* ptr = &number;
//
//     - number lives on the STACK, created automatically when the scope is entered
//     - ptr just holds the address of number — it does NOT own the memory
//     - memory is freed automatically when number goes out of scope
//     - ptr becomes dangling the moment number's scope ends — never store it longer
//     - no new, no delete — the compiler manages the lifetime
//
//   ── Option B: allocate a new object on the heap ──
//     int* ptr = new int;
//     int* ptr = new int(10);   // allocate + initialize to 10
//
//     - allocates fresh memory on the HEAP — no named variable backing it
//     - ptr is the ONLY way to reach this memory — you own it
//     - memory persists until you explicitly call delete ptr
//     - forgetting delete = memory leak (leaked until process exits)
//     - ptr going out of scope does NOT free the memory — the heap block outlives the pointer
//
// SIDE-BY-SIDE:
//   int number = 10;           int* ptr = new int(10);
//   int* ptr   = &number;
//   ┌─────────────────────────────────────────────────────┐
//   │ STACK                    │ HEAP                     │
//   │  number [ 10 ] ◄── ptr   │  [ 10 ] ◄── ptr          │
//   │  freed when scope exits  │  freed only on delete    │
//   └─────────────────────────────────────────────────────┘
//
// WHEN TO USE EACH:
//   &variable (stack pointer) — read/modify a local you already have,
//                               pass it to a function by pointer/reference,
//                               observe memory you don't own
//   new (heap allocation)     — object must outlive the current scope,
//                               size unknown until runtime,
//                               large object that would overflow the stack,
//                               transferring ownership across functions
//
// MUST EVERY new MATCH A delete?
//   YES — every new must have exactly one delete. No exceptions.
//   No delete         = memory leak (heap block never returned until process exits)
//   delete twice      = double-free = UB (heap corruption, crash, security vulnerability)
//   Wrong delete form = UB:
//     new T    → delete p     (single object, no brackets)
//     new T[n] → delete[] p   (array, brackets required — never mix these)
//   The only way out of writing delete manually is handing ownership to a smart pointer,
//   which calls delete for you in its destructor. That still counts as "matching" new.
//
// MUST EVERY delete MATCH A = nullptr?
//   NO — not required by the language. But here is why you should care:
//
//   After delete, ptr still holds the old address — it is now a DANGLING pointer.
//   The memory is freed but the pointer does not know that.
//   Reading *ptr after delete is UB — may crash, return garbage, or seem fine (worst case).
//
//   Setting nullptr after delete:
//     delete ptr;
//     ptr = nullptr;
//   - makes if (ptr) checks reliable — nullptr is a detectable invalid state
//   - turns a silent, hard-to-find bug into an immediate, obvious crash
//   - a loud bug is always better than a silent one
//
//   WHEN YOU CAN SKIP IT:
//     Short-lived scope, pointer never touched after delete, goes out of scope immediately:
//       void fn() { int* p = new int(10); delete p; }  // p dies here, nullptr adds nothing
//
//   ALWAYS DO IT:
//     Class members, long-lived functions, anything reusable — another code path
//     might read the pointer later. Make it fail loudly, not silently.
//
// new THROWS ON FAILURE:
//   If the heap is exhausted, new throws std::bad_alloc — not a nullptr return.
//   You do NOT need to check (ptr == nullptr) after new.
//   Use new(nothrow) if you prefer a nullptr return over an exception:
//     int* p = new(nothrow) int;
//     if (!p) { /* handle */ }
//
// PREFER RAII IN MODERN C++ — avoid raw new/delete in application code:
//   unique_ptr<int> p = make_unique<int>(10);  // auto-deleted, no leak possible
//   *p = 20;                                   // same dereference syntax
//   // no delete needed — freed when p goes out of scope
//
// =============================================================================

#include <iostream>
#include <memory>   // unique_ptr, make_unique
using namespace std;

int main() {
    //     =============================================================───────────────
    // Stack pointer — ptr observes number, does NOT own the memory
    //     =============================================================───────────────
    int number = 10;
    int *stackPtr = &number;

    cout << "stack value    : " << number << "\n";
    cout << "via stackPtr   : " << *stackPtr << "\n";
    *stackPtr = 99;
    cout << "after *stackPtr = 99, number = " << number << "\n\n";
    // No delete — number is stack-allocated, freed automatically at scope exit

    //     =============================================================───────────────
    // Heap allocation — ptr owns the memory, must delete
    //     =============================================================───────────────
    int *heapPtr = new int(777); // allocate + initialize in one step
    cout << "heap int       : " << *heapPtr << "\n";

    *heapPtr = 888;
    cout << "after mutation : " << *heapPtr << "\n";

    delete heapPtr; // free the heap block
    heapPtr = nullptr; // dangling pointer → nullptr: if (heapPtr) checks now work
    // delete heapPtr;  // DON'T — double-free is UB even after nullptr (skip if already null)
    cout << "\n";

    //     =============================================================───────────────
    // Same pattern for double
    //     =============================================================───────────────
    double *heapDbl = new double(70.80);
    cout << "heap double    : " << *heapDbl << "\n";

    delete heapDbl;
    heapDbl = nullptr;
    cout << "\n";

    //     =============================================================───────────────
    // Short scope — nullptr optional, ptr dies immediately after delete anyway
    //     =============================================================───────────────
    {
        int *p = new int(55);
        cout << "short scope    : " << *p << "\n";
        delete p;
        // p = nullptr;  // skippable — p goes out of scope on the next line
    }
    cout << "\n";

    //     =============================================================───────────────
    // Modern C++ — unique_ptr, same heap allocation, no manual delete
    //     =============================================================───────────────
    auto smart = make_unique<int>(42);
    cout << "unique_ptr     : " << *smart << "\n";
    *smart = 100;
    cout << "after mutation : " << *smart << "\n";
    // freed automatically when smart goes out of scope — no delete needed

    return 0;
}
