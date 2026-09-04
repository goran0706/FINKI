// =============================================================================
// functions.cpp — C++ Functions: The Programming Modules
// Learning file — Concepts, Prototypes, Parameters, Passing Modes, Arrays, Strings, Structures, Recursion, Function Pointers
// =============================================================================
//
// This file serves as both reference and runnable demonstration of core function-related concepts in C++.
// Compile and run to see output while reading the comments.

// ─────────────────────────────────────────────────────────────────────────
// 1. Functions — Basic Anatomy & Purpose
// ─────────────────────────────────────────────────────────────────────────

// ANATOMY OF A FUNCTION:
//   return_type name(param_type param, ...) {     // header / interface
//       // body
//       return value;                             // required unless return type is void
//   }
//
//   • Return type  — what the function gives back (void = nothing)
//   • Name         — follows variable naming rules
//   • Parameters   — local variables that receive caller's arguments
//   • Body         — statements; locals are stack-allocated

// DECLARATION vs DEFINITION:
//   Declaration (prototype) — tells compiler signature exists somewhere
//     int add(int a, int b);          // names optional here
//     int add(int, int);              // also valid
//
//   Definition — actual code body
//   Rule: declare before use. Common style: prototypes near top, definitions after main()

// FUNCTION OVERLOADING (same name, different parameter lists)
//   Return type alone is NOT enough to distinguish overloads
//   Examples:
//     int    add(int a, int b);
//     double add(double a, double b);
//     // int add(int a, int b, int c);   // would be another overload

// inline FUNCTIONS (hint — usually for very small functions)
//   Modern compilers often inline anyway — rarely need explicit inline keyword today
//     inline int square(int x) { return x * x; }

// constexpr FUNCTIONS (C++11+) — compile-time evaluation when possible
//     constexpr int square(int x) { return x * x; }
//     constexpr int fact5 = square(5);   // computed at compile time

// DEFAULT ARGUMENTS (must be rightmost parameters)
//   Declared in prototype only (not in definition)
//     int add(int a, int b, int c = 0);

// ─────────────────────────────────────────────────────────────────────────
// 2. Function Arguments — Passing Modes
// ─────────────────────────────────────────────────────────────────────────

// 1. Pass-by-value (default for non-array types)
//    Copy is made → original unchanged
//    Safe, but expensive for large objects

// 2. Pass-by-reference (using &)
//    Alias to caller's variable → no copy, can modify original
//    Use when function must change caller's data
//    Use const& when passing large read-only objects (zero copy + safety)

// 3. Pass-by-pointer (explicit address)
//    Used for: C-style arrays, optional parameters (nullptr), C interop
//    Prefer references to pointers for non-array, non-optional cases

// INTEGER DIVISION & REMAINDER notes:
//   /  → truncates toward zero (7/2 = 3, -7/2 = -3)
//   %  → sign follows dividend (-7 % 2 = -1)
//   Always check divisor != 0 — division by zero is undefined behavior

// ─────────────────────────────────────────────────────────────────────────
// 3. Functions and Arrays (1D)
// ─────────────────────────────────────────────────────────────────────────

// Arrays decay to pointer to first element when passed
//   void print(int a[], int n)   ≡   void print(int* a, int n)
//   Inside function: sizeof(a) == sizeof(pointer) — NOT array size!
//   → Always pass size explicitly!

// Using const pointer parameter (cannot modify elements)
//   const int* arr   → read-only view of data

// ─────────────────────────────────────────────────────────────────────────
// 4. Functions and Two-Dimensional Arrays
// ─────────────────────────────────────────────────────────────────────────

// All dimensions except the first must be known at compile time
//   void print(int m[][10], int rows, int cols)
// Prefer modern alternatives: std::vector<std::vector<T>> or std::span (C++20)

// ─────────────────────────────────────────────────────────────────────────
// 5. Functions and C-Style Strings (const char*)
// ─────────────────────────────────────────────────────────────────────────

// C-style strings are null-terminated char arrays
// Pass as const char* to avoid accidental modification

// ─────────────────────────────────────────────────────────────────────────
// 6. Functions and std::string Class Objects
// ─────────────────────────────────────────────────────────────────────────

// Prefer const string& for read-only access (efficient, no copy)

// ─────────────────────────────────────────────────────────────────────────
// 7. Functions and Structures (and class objects)
// ─────────────────────────────────────────────────────────────────────────

// Usually pass by const reference for efficiency & safety

// ─────────────────────────────────────────────────────────────────────────
// 8. Recursion
// ─────────────────────────────────────────────────────────────────────────

// Function calls itself — must have base case(s) to terminate

// ─────────────────────────────────────────────────────────────────────────
// 9. Pointers to Functions
// ─────────────────────────────────────────────────────────────────────────

// Can store address of function, pass functions as arguments, etc.

#include <iostream>
using namespace std;

// Inline Functions — small functions suggested to inline
inline int square(int x) { return x * x; }

// Reference Variables — modifying caller variables via &
void incrementByRef(int &val) {
    val += 1;
}

// Function Overloading
int multiply(int a, int b) { return a * b; }
double multiply(double a, double b) { return a * b; }

// Function Templates — generic functions
template<typename T>
T genericAdd(T a, T b) {
    return a + b;
}

template<typename T>
void printGenericArray(const T *arr, int n) {
    for (int i = 0; i < n; ++i)
        cout << arr[i] << " ";
    cout << "\n";
}

// ─────────────────────────────────────────────────────────────────────────
// Structure example
// ─────────────────────────────────────────────────────────────────────────
struct Point {
    int x;
    int y;
};

// ─────────────────────────────────────────────────────────────────────────
// Prototypes (declarations)
// ─────────────────────────────────────────────────────────────────────────
void sayHello();

int add(int a, int b);

int sub(int a, int b);

int mul(int a, int b);

int divide(int a, int b);

int remainder(int a, int b);

constexpr int ArrSize = 10;
constexpr int Rows = 2;
constexpr int Cols = 10;

void printArray(int a[], int n);

void printConstArray(const int *a, int n);

void print2DArray(int matrix[][Cols], int rows, int cols);

void printCString(const char *str);

void printString(const string &s);

void printPoint(const Point &p);

int factorial(int n);

int operate(int a, int b, int (*func)(int, int));

int addWithDefault(int a, int b, int c = 0);

// New concept prototypes (also declared above, required for template + inline)
inline int square(int x);

void incrementByRef(int &val);

int multiply(int a, int b);

double multiply(double a, double b);

template<typename T>
T genericAdd(T a, T b);

template<typename T>
void printGenericArray(const T *arr, int n);

// ─────────────────────────────────────────────────────────────────────────
// main — demonstration
// ─────────────────────────────────────────────────────────────────────────
int main() {
    int x = 10;
    int y = 2;

    int arr[ArrSize] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int matrix[Rows][Cols] = {
        {1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
        {11, 12, 13, 14, 15, 16, 17, 18, 19, 20}
    };
    char text[] = "Hello C string";
    string str = "Hello std::string";

    Point p{3, 4};

    sayHello();

    cout << "add(10,2)      = " << add(x, y) << "\n";
    cout << "sub(10,2)      = " << sub(x, y) << "\n";
    cout << "mul(10,2)      = " << mul(x, y) << "\n";
    cout << "divide(10,2)   = " << divide(x, y) << "\n";
    cout << "remainder(10,2)= " << remainder(x, y) << "\n\n";

    cout << "addWithDefault = " << addWithDefault(5, 7) << "  (c defaults to 0)\n\n";

    cout << "1D array:        ";
    printArray(arr, ArrSize);
    cout << "const 1D array:  ";
    printConstArray(arr, ArrSize);

    cout << "\n2D array:\n";
    print2DArray(matrix, Rows, Cols);

    printCString(text);
    printString(str);

    printPoint(p);

    cout << "\nfactorial(5) = " << factorial(5) << "\n";

    int (*operation)(int, int) = add;
    cout << "Function pointer call: " << operation(5, 3) << "\n";
    cout << "operate(sub)         : " << operate(5, 3, sub) << "\n";
    cout << "operate via variable : " << operate(5, 3, operation) << "\n\n";

    // Demonstration of new topics — fully integrated
    cout << "--- Additional Function Concepts ---\n";

    cout << "square(5) = " << square(5) << "\n";

    incrementByRef(x);
    cout << "After incrementByRef(x), x = " << x << "\n";

    cout << "multiply(int)   = " << multiply(3, 4) << "\n";
    cout << "multiply(double)= " << multiply(3.5, 2.0) << "\n";

    cout << "genericAdd(int)    = " << genericAdd(5, 7) << "\n";
    cout << "genericAdd(double) = " << genericAdd(2.2, 3.3) << "\n";

    cout << "printGenericArray<int>: ";
    printGenericArray(arr, ArrSize);

    double darr[ArrSize] = {1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, 10.0};
    cout << "printGenericArray<double>: ";
    printGenericArray(darr, ArrSize);

    return 0;
}

// ─────────────────────────────────────────────────────────────────────────
// Function definitions
// ─────────────────────────────────────────────────────────────────────────
void sayHello() {
    cout << "Hello!\n";
}

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

int divide(int a, int b) {
    if (b == 0) {
        cerr << "divide: division by zero\n";
        return 0;
    }
    return a / b;
}

int remainder(int a, int b) {
    if (b == 0) {
        cerr << "remainder: division by zero\n";
        return 0;
    }
    return a % b;
}

int addWithDefault(int a, int b, int c) { return a + b + c; }

void printArray(int a[], int n) {
    for (int i = 0; i < n; ++i) cout << a[i] << " ";
    cout << "\n";
}

void printConstArray(const int *a, int n) {
    for (int i = 0; i < n; ++i) cout << a[i] << " ";
    cout << "\n";
}

void print2DArray(int matrix[][Cols], int rows, int cols) {
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) cout << matrix[i][j] << " ";
        cout << "\n";
    }
}

void printCString(const char *str) {
    cout << "C-string: ";
    while (*str) cout << *str++;
    cout << "\n";
}

void printString(const string &s) {
    cout << "std::string: " << s << "\n";
}

void printPoint(const Point &p) {
    cout << "Point(" << p.x << "," << p.y << ")\n";
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int operate(int a, int b, int (*func)(int, int)) {
    return func(a, b);
}

inline int square(int x) { return x * x; }

void incrementByRef(int &val) { val += 1; }
