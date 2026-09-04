// =============================================================================
// arrays.cpp — C-Style Arrays: Declaration, Initialization, and Access
// =============================================================================
//
// WHAT IS AN ARRAY:
//   An array is a fixed-size, contiguous sequence of elements all of the same type.
//   "Contiguous" means all elements are stored back-to-back in memory with no gaps.
//   The type of each element and the size are both fixed at compile time.
//
//   Arrays are a COMPOUND TYPE — built from another type.
//   There is no generic "array" type — only "array of int", "array of char", etc.
//     int  scores[10];   — array of 10 ints
//     char name[30];     — array of 30 chars (C-string)
//     double prices[5];  — array of 5 doubles
//
// DECLARATION SYNTAX:
//   typeName arrayName[arraySize];
//
//   arraySize MUST be a compile-time integer constant:
//     int arr[10];                    — OK: integer literal
//     constexpr int N = 10;
//     int arr[N];                     — OK: constexpr
//     int arr[8 * sizeof(int)];       — OK: constant expression
//     int n = 10; int arr[n];         — NOT OK in standard C++: runtime value (VLA)
//                                       Compiles as a GCC extension but avoid it.
//
// INDEXING:
//   Arrays are 0-indexed: first element is arr[0], last is arr[n-1].
//   arr[n] is OUT OF BOUNDS — no runtime check, no exception, just UB.
//   The compiler will NOT warn you about out-of-bounds access at runtime.
//   It is entirely your responsibility to stay within bounds.
//   Use std::array or std::vector with .at(i) for bounds-checked access.
//
// INITIALIZATION:
//   int arr[5] = {1, 2, 3, 4, 5};    — fully initialized
//   int arr[5] = {1, 2};             — partial: arr[2..4] zero-initialized
//   int arr[5] = {};                 — all zeros (value-initialized)
//   int arr[5] = {0};                — all zeros (common idiom)
//   int arr[]  = {1, 2, 3};          — compiler infers size as 3
//
//   Without initialization: int arr[5]; — values are INDETERMINATE (garbage)
//   Reading uninitialized values is UB. Always initialize.
//
// LETTING THE COMPILER COUNT:
//   int arr[] = {1, 5, 3, 8};
//   The compiler infers the size from the initializer list — arr has 4 elements.
//   Useful for read-only lookup tables where the size is implied by the data.
//   Risky if you accidentally omit an element — the size silently changes.
//   Always verify with sizeof or an explicit size constant when correctness matters.
//
// GETTING THE SIZE:
//   sizeof(arr)              — total bytes: sizeof(type) * number_of_elements
//   sizeof(arr) / sizeof(arr[0])  — number of elements (ONLY works for true arrays)
//   sizeof(arr) / sizeof(int)     — same, but fragile if type changes
//   THIS DOES NOT WORK ON POINTERS:
//     void fn(int arr[]) { sizeof(arr); }  — gives 8 (pointer size), not array size
//     Arrays decay to pointers when passed to functions — size is lost.
//   C++17: std::size(arr) — cleaner, also works on STL containers
//   C++20: std::ssize(arr) — returns signed size (avoids signed/unsigned warnings)
//
// ARRAY DECAY:
//   In most expressions, an array name converts to a pointer to its first element.
//     int arr[5]; int* p = arr;  — p == &arr[0]
//   Exceptions where decay does NOT happen:
//     sizeof(arr)   — gives full array size, not pointer size
//     &arr          — gives pointer to the whole array (type: int(*)[5]), not int*
//     decltype(arr) — preserves array type
//   Once an array decays to a pointer, the size information is gone forever.
//
// MULTIDIMENSIONAL ARRAYS:
//   int matrix[3][4];          — 3 rows, 4 cols, stored row-major in memory
//   matrix[i][j]               — element at row i, column j
//   int m[2][3] = {{1,2,3},{4,5,6}};
//   When passed to functions, all dimensions except the first must be specified:
//     void fn(int m[][4], int rows)  — cols must be compile-time constant
//
// PREFER MODERN ALTERNATIVES:
//   std::array<T, N>   — same stack/fixed-size semantics, bounds checking, no decay
//   std::vector<T>     — dynamic size, heap-allocated, fully safe
//   Use C-style arrays for: C interop, embedded/no-heap, fixed lookup tables.
//
// =============================================================================

#include <iostream>
#include <array>    // std::size (C++17)
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Declaration and initialization
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Declaration and Initialization ===\n";

    int full[5] = {1, 2, 3, 4, 5}; // fully initialized
    int partial[5] = {1, 2}; // rest zero-initialized: {1, 2, 0, 0, 0}
    int zeroed[5] = {}; // all zeros
    int inferred[] = {10, 20, 30, 40}; // compiler infers size = 4

    cout << "full[0]    : " << full[0] << "\n";
    cout << "partial[4] : " << partial[4] << "\n"; // 0 — zero-initialized
    cout << "zeroed[2]  : " << zeroed[2] << "\n"; // 0
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Indexing — 0 to n-1
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Indexing (0-based) ===\n";
    for (int i = 0; i < 5; i++) {
        cout << "full[" << i << "] = " << full[i] << "\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // sizeof — get element count (only for true arrays, not pointers)
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== sizeof ===\n";
    cout << "sizeof(full)          : " << sizeof(full) << " bytes\n"; // 20
    cout << "sizeof(full[0])       : " << sizeof(full[0]) << " bytes\n"; // 4
    cout << "element count         : " << sizeof(full) / sizeof(full[0]) << "\n"; // 5
    cout << "std::size(inferred)   : " << std::size(inferred) << "\n"; // 4 (C++17)
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Letting the compiler count — useful for lookup tables
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Compiler-inferred size ===\n";
    const char *days[] = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
    int numDays = sizeof(days) / sizeof(days[0]);
    for (int i = 0; i < numDays; i++) {
        cout << days[i] << " ";
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Modifying elements
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Modifying elements ===\n";
    int scores[5] = {70, 80, 90, 60, 85};
    scores[2] = 95; // modify third element
    for (int i = 0; i < 5; i++) {
        cout << scores[i] << " ";
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Array decay — name becomes pointer, size is lost
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Array decay ===\n";
    int arr[5] = {1, 2, 3, 4, 5};
    int *p = arr; // decays to &arr[0]

    cout << "sizeof(arr) in scope : " << sizeof(arr) << "\n"; // 20 — full array
    cout << "sizeof(p)            : " << sizeof(p) << "\n"; // 8  — pointer size
    cout << "arr == &arr[0]       : " << (arr == &arr[0] ? "true" : "false") << "\n";
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 2D array — row-major storage
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== 2D array ===\n";
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            cout << matrix[i][j] << "\t";
        }
        cout << "\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Out-of-bounds — no error, silent UB (shown for awareness, never do this)
    // ─────────────────────────────────────────────────────────────────────────
    // arr[5] = 99;   // UB — writes past the end of the array
    // arr[-1] = 0;   // UB — writes before the start
    // Use std::array::at(i) or std::vector::at(i) for bounds-checked access

    return 0;
}
