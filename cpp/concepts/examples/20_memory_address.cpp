// =============================================================================
// memory_address.cpp — Addresses in Memory
// =============================================================================
//
// EVERY VARIABLE HAS AN ADDRESS:
//   When you declare a variable, the compiler allocates space in memory and
//   assigns it an address — the location of its first byte.
//
//   int x = 10;
//   &x   — address-of operator, returns the memory address where x lives
//   The address is a hexadecimal value, e.g. 0x7ffd2a3b
//
// ADDRESS-OF OPERATOR &:
//   &variable   — returns a pointer to that variable (address of first byte)
//   Works on any variable: int, double, struct, array element, etc.
//   The type of &x where x is int is int* (pointer to int).
//
// ADDRESSES AND TYPES:
//   The address itself is just a number (a memory location).
//   The TYPE of the pointer tells the compiler how many bytes to read from
//   that address and how to interpret them:
//     int*    — read 4 bytes, interpret as integer
//     double* — read 8 bytes, interpret as IEEE 754 float
//     char*   — read 1 byte
//
// ARRAYS IN MEMORY — CONTIGUOUS LAYOUT:
//   Array elements are stored in consecutive bytes with no gaps.
//   The array name gives the address of the first element.
//     int arr[3] = {1, 2, 3};
//     Memory: [1][1][1][1][2][2][2][2][3][3][3][3]  (4 bytes each for int)
//     &arr[0] == arr       — address of first element
//     &arr[1] == arr + 4   — 4 bytes after arr[0] (for int)
//     &arr[2] == arr + 8
//   The type is what lets the compiler know to skip 4 bytes (int) vs
//   8 bytes (double) vs 1 byte (char) to reach the next element.
//
// sizeof AND ADDRESSES:
//   sizeof(x)   — number of bytes the variable occupies, NOT its address
//   sizeof(int) — always 4 on most platforms
//   Address spacing between consecutive array elements == sizeof(element type)
//
// STACK ADDRESS BEHAVIOR:
//   Variables declared inside a function live on the stack.
//   Stack grows downward on most architectures — later variables often have
//   lower addresses than earlier ones (implementation-defined, don't rely on it).
//   Addresses are only valid for the lifetime of the variable's scope.
//   Never store or return the address of a local variable — it becomes invalid
//   the moment the scope exits (dangling reference).
//
// =============================================================================

#include <iostream>
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Address of a simple variable
    // ─────────────────────────────────────────────────────────────────────────
    int number = 10;
    cout << "Value   : " << number << "\n"; // 10
    cout << "Address : " << &number << "\n\n"; // e.g. 0x7ffd2a3b

    // ─────────────────────────────────────────────────────────────────────────
    // Different types — same address concept, different sizes
    // ─────────────────────────────────────────────────────────────────────────
    double d = 3.14;
    char c = 'A';
    cout << "double value: " << d << "  address: " << &d << "  size: " << sizeof(d) << " bytes\n";
    cout << "char   value: " << c << "  address: " << (void *) &c << "  size: " << sizeof(c) << " byte\n\n";
    // (void*)&c — cast needed: cout treats char* as a C-string, not an address

    // ─────────────────────────────────────────────────────────────────────────
    // Array — contiguous memory, each element sizeof(int) bytes apart
    // ─────────────────────────────────────────────────────────────────────────
    int arr[5] = {1, 2, 3, 4, 5};

    cout << "arr (first element address) : " << arr << "\n";
    cout << "&arr[0]                     : " << &arr[0] << "\n"; // same as arr
    cout << "&arr[1]                     : " << &arr[1] << "\n"; // +4 bytes
    cout << "&arr[2]                     : " << &arr[2] << "\n"; // +8 bytes
    cout << "\n";

    // Confirm spacing equals sizeof(int)
    cout << "sizeof(int)          : " << sizeof(int) << " bytes\n";
    cout << "gap arr[0]→arr[1]    : " << (&arr[1] - &arr[0]) << " element(s)\n"; // 1
    cout << "byte gap (as char*)  : "
            << (char *) &arr[1] - (char *) &arr[0] << " bytes\n\n"; // 4

    // ─────────────────────────────────────────────────────────────────────────
    // Stack address direction — later vars often at lower addresses
    // ─────────────────────────────────────────────────────────────────────────
    int first = 1;
    int second = 2;
    int third = 3;
    cout << "first  address: " << &first << "\n";
    cout << "second address: " << &second << "\n";
    cout << "third  address: " << &third << "\n";

    return 0;
}
