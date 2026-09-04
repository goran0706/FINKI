// =============================================================================
// loops.cpp — for, while, do-while, range-for, and Loop Control
// =============================================================================
//
// LOOP TYPES — WHEN TO USE EACH:
//   for          — iteration count known upfront, index needed
//   while        — iterate while a condition holds, count unknown
//   do-while     — same as while but body always runs at least once
//   range-for    — iterate over all elements of a container or array (C++11)
//
// ── for LOOP ────────────────────────────────────────────────────────────────
//   for (init; condition; update) { body }
//
//   All three parts are optional:
//     for (;;) { }           — infinite loop (same as while(true))
//     for (int i = 0; ; i++) — no condition = infinite
//   init runs ONCE before the first iteration.
//   condition checked BEFORE each iteration — if false at start, body never runs.
//   update runs AFTER each iteration.
//
//   Multiple init/update expressions with comma operator:
//     for (int i = 0, j = 10; i < j; i++, j--) { }
//
//   Loop variable scope: i is scoped to the for block (C++).
//   Avoid modifying the loop variable inside the body — makes flow hard to follow.
//
// ── while LOOP ──────────────────────────────────────────────────────────────
//   while (condition) { body }
//
//   Condition checked BEFORE each iteration.
//   Body may never execute if condition is false from the start.
//   Use when the number of iterations is not known ahead of time:
//     reading input until valid, processing until EOF, game loops, event loops.
//
// ── do-while LOOP ───────────────────────────────────────────────────────────
//   do { body } while (condition);
//
//   Body executes FIRST, then condition is checked.
//   Guaranteed to run at least once — useful for menus and input validation
//   where you need one execution before you can check the condition.
//   Note the semicolon after the closing parenthesis — required, easy to forget.
//
// ── range-for LOOP (C++11) ──────────────────────────────────────────────────
//   for (declaration : range) { body }
//
//   Iterates over every element in a range: array, vector, string, any container.
//     for (int x : arr)              — copies each element (safe to modify x, original unchanged)
//     for (const int& x : arr)       — read-only reference, no copy (PREFERRED for read)
//     for (int& x : arr)             — mutable reference, modifies original elements
//     for (const auto& x : container)— deduce type, const ref (safest default)
//   Cannot use range-for with a raw pointer + size pair — use index-based for or span.
//
// LOOP CONTROL STATEMENTS:
//   break    — exit the loop immediately, resume after the closing brace
//   continue — skip the rest of the current iteration, jump to update (for) or condition check
//   return   — exit the entire function (also exits any loop)
//   goto     — avoid; structured loops and break/continue cover all real cases
//
//   break/continue in NESTED loops affect only the INNERMOST loop.
//   To break out of nested loops: use a flag variable, or restructure into a function
//   and use return, or (rarely) use labeled goto.
//
// INFINITE LOOPS — CANONICAL FORMS:
//   for (;;) { }        — idiomatic in C/C++, no condition overhead
//   while (true) { }    — more readable, equally common
//   Always pair with a break, return, or external signal to exit.
//
// PERFORMANCE NOTES:
//   - Hoist invariant expressions out of the loop condition/body (don't call .size() each iter if it doesn't change)
//   - Cache container size: for (int i = 0, n = v.size(); i < n; i++)
//   - Prefer range-for or iterators over index-based for STL containers
//   - Prefer ++i over i++ for non-primitive types (avoids a copy), though compilers optimize it
//
// OFF-BY-ONE — MOST COMMON LOOP BUG:
//   for (int i = 0; i <= n; i++)  — runs n+1 times (usually wrong for 0-indexed arrays)
//   for (int i = 0; i < n; i++)   — runs n times (correct for 0-indexed)
//   for (int i = 1; i <= n; i++)  — runs n times (correct for 1-indexed)
//   Array of size n: valid indices are 0..n-1. Loop condition must be i < n, not i <= n.
//
// TYPEDEFS (TYPE ALIASES):
//
//   typedef allows creating an alias for an existing type.
//   Useful for readability and portability.
//
//     typedef unsigned long ulong;
//     typedef vector<int> IntVector;
//
//   Then:
//
//     ulong x = 10;
//     IntVector v;
//
//   Modern C++ equivalent:
//
//     using ulong = unsigned long;
//
// =============================================================================

#include <iostream>
#include <vector>
#include <string>
using namespace std;

// typedef examples
typedef unsigned long ulong;
typedef vector<int> IntVector;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // for — count known, index needed
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== for loop ===\n";
    for (int i = 0; i < 5; i++) {
        cout << i << " ";
    }
    cout << "\n\n";

    // counting down
    for (int i = 5; i > 0; i--) {
        cout << i << " ";
    }
    cout << "\n\n";

    // multiple init/update with comma operator
    for (int i = 0, j = 10; i < j; i++, j--) {
        cout << "i=" << i << " j=" << j << "\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // while — condition-driven, count unknown
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== while loop ===\n";
    int n = 1;
    while (n < 100) {
        cout << n << " ";
        n *= 2; // doubles each iteration — not a fixed count
    }
    cout << "\n\n";

    // input validation with while
    // int input;
    // cout << "Enter a positive number: ";
    // while (!(cin >> input) || input <= 0) {
    //     cin.clear();
    //     cin.ignore(numeric_limits<streamsize>::max(), '\n');
    //     cout << "Invalid. Try again: ";
    // }

    // ─────────────────────────────────────────────────────────────────────────
    // do-while — body always runs at least once
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== do-while loop ===\n";
    int x = 10;
    do {
        cout << x << " ";
        x++;
    } while (x < 5); // condition false from start — still runs once
    cout << "\n\n";

    // menu pattern — classic do-while use case
    // int choice;
    // do {
    //     cout << "1. Play\n2. Quit\nChoice: ";
    //     cin >> choice;
    // } while (choice != 2);

    // ─────────────────────────────────────────────────────────────────────────
    // range-for — over array, vector, string
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== range-for ===\n";
    int arr[] = {10, 20, 30, 40, 50};

    // copy — x is a local copy, original unchanged
    for (int x: arr) {
        cout << x << " ";
    }
    cout << "\n";

    // const ref — no copy, read-only (preferred for non-trivial types)
    vector<string> names = {"Alice", "Bob", "Charlie"};
    for (const string &name: names) {
        cout << name << " ";
    }
    cout << "\n";

    // mutable ref — modifies original elements in-place
    vector<int> nums = {1, 2, 3, 4, 5};
    for (int &num: nums) {
        num *= 2;
    }
    for (const auto &num: nums) {
        cout << num << " "; // 2 4 6 8 10
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // break — exit loop early
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== break ===\n";
    for (int i = 0; i < 10; i++) {
        if (i == 5) break; // stop when i reaches 5
        cout << i << " "; // prints 0 1 2 3 4
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // continue — skip current iteration
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== continue ===\n";
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 0) continue; // skip even numbers
        cout << i << " "; // prints 1 3 5 7 9
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Nested loops — break only exits innermost
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== nested loops ===\n";
    bool found = false;
    for (int i = 0; i < 4 && !found; i++) {
        // flag controls outer loop
        for (int j = 0; j < 4; j++) {
            if (i == 2 && j == 2) {
                found = true;
                break; // exits inner loop only
            }
            cout << "(" << i << "," << j << ") ";
        }
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Infinite loop with break
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== infinite loop ===\n";
    int count = 0;
    for (;;) {
        // or: while (true)
        if (count >= 5) break;
        cout << count << " ";
        count++;
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // typedef usage example
    // ─────────────────────────────────────────────────────────────────────────
    cout << "\n=== typedef examples ===\n";

    ulong bigNumber = 1000000;
    cout << "ulong value: " << bigNumber << "\n";

    IntVector values = {1, 2, 3, 4};
    for (int v: values) cout << v << " ";
    cout << "\n";

    return 0;
}
