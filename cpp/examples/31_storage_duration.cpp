// =============================================================================
// storage_duration.cpp — Automatic, Static, and Dynamic Storage in C++
// =============================================================================
//
// STORAGE DURATION
//
//   Storage duration describes HOW LONG a variable exists in memory
//   and WHERE it is stored.
//
//   C++ provides several storage durations:
//
//      1. Automatic storage  (stack)
//      2. Static storage     (data segment)
//      3. Dynamic storage    (heap)
//
//     =============================================================───────────────
// 1. AUTOMATIC STORAGE
//     =============================================================───────────────
//
//   Default for local variables inside functions.
//
//   Created when the block/function begins.
//   Destroyed automatically when the block/function ends.
//
//   Stored in: STACK
//
//   Example:
//
//      void fn() {
//          int x = 5;
//      }
//
//   Each call to the function creates a NEW variable.
//
//     =============================================================───────────────
// 2. STATIC STORAGE
//     =============================================================───────────────
//
//   Variable exists for the ENTIRE lifetime of the program.
//
//   Memory allocated once at program start.
//   Destroyed when the program terminates.
//
//   Two common uses:
//
//      static local variable
//      global variable
//
//   Static variables keep their value between function calls.
//
//     =============================================================───────────────
// 3. DYNAMIC STORAGE
//     =============================================================───────────────
//
//   Memory allocated manually during runtime using:
//
//      new
//
//   Memory must be released manually:
//
//      delete
//
//   Stored in: HEAP
//
//   Used when size or lifetime is not known at compile time.
//
//     =============================================================───────────────
// STORAGE COMPARISON
//     =============================================================───────────────
//
//   Storage Type | Location | Lifetime                | Managed by
//   -------------|----------|-------------------------|-------------
//   Automatic    | Stack    | Block/function scope    | Compiler
//   Static       | Data     | Entire program          | Compiler
//   Dynamic      | Heap     | Until delete is called  | Programmer
//
// =============================================================================

#include <iostream>
using namespace std;

//     =============================================================───────────────
// Global variable (static storage)
//     =============================================================───────────────

int globalVar = 100;


//     =============================================================───────────────
// Function demonstrating static local variable
//     =============================================================───────────────

void staticExample() {
    static int counter = 0; // created once, retains value
    counter++;

    cout << "static counter: " << counter << "\n";
}


//     =============================================================───────────────
// Function demonstrating automatic variable
//     =============================================================───────────────

void automaticExample() {
    int x = 10; // automatic storage

    cout << "automatic x: " << x << "\n";
}


// =============================================================================
// MAIN
// =============================================================================

int main() {
    //     =============================================================───────────────
    // 1. Automatic storage
    //     =============================================================───────────────

    cout << "=== Automatic Storage ===\n";

    int a = 5; // automatic variable
    cout << "a = " << a << "\n\n";


    //     =============================================================───────────────
    // 2. Static storage
    //     =============================================================───────────────

    cout << "=== Static Storage ===\n";

    cout << "globalVar = " << globalVar << "\n";

    staticExample();
    staticExample();
    staticExample(); // value persists across calls

    cout << "\n";


    //     =============================================================───────────────
    // 3. Dynamic storage
    //     =============================================================───────────────

    cout << "=== Dynamic Storage ===\n";

    int *p = new int; // allocate on heap

    *p = 42;

    cout << "*p = " << *p << "\n";

    delete p; // free memory
    p = nullptr;

    cout << "\n";


    //     =============================================================───────────────
    // Dynamic array example
    //     =============================================================───────────────

    cout << "=== Dynamic Array ===\n";

    int n = 5;

    int *arr = new int[n];

    for (int i = 0; i < n; i++)
        arr[i] = i * 10;

    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";

    cout << "\n";

    delete[] arr;
    arr = nullptr;


    return 0;
}

// =============================================================================
// KEY TAKEAWAYS
// =============================================================================
//
//   AUTOMATIC STORAGE
//     int x;
//     lifetime → block scope
//
//   STATIC STORAGE
//     static int x;
//     global variables
//     lifetime → entire program
//
//   DYNAMIC STORAGE
//     int* p = new int;
//     delete p;
//
//     int* arr = new int[n];
//     delete[] arr;
//
// =============================================================================
