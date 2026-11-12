// A C++ program is a collection of functions, and each function
// contains a sequence of statements that are executed in order.
//
//
// ─────────────────────────────────────────────────────────────
// Expression
// ─────────────────────────────────────────────────────────────
// An expression is a combination of values, variables, operators,
// and function calls that the compiler evaluates to produce a value.
//
// Examples:
//     5 + 3
//     x * 10
//     a + b / 2
//
//
// ─────────────────────────────────────────────────────────────
// Statement
// ─────────────────────────────────────────────────────────────
// A statement is a complete instruction that the program executes.
// Most statements in C++ end with a semicolon (;).
//
// Note:
// An expression becomes a statement when followed by a semicolon.
// This is called an expression statement.
//
// Example:
//     x + 5;   // result is calculated but not used
//
//
// ─────────────────────────────────────────────────────────────
// There are several kinds of statements in C++:
// ─────────────────────────────────────────────────────────────
// 1. Declaration statement
//    Declares a variable, function, or object.
//    Example:
//        int number;
//
// 2. Initialization statement
//    Declares a variable and assigns its first value.
//    Example:
//        int number = 10;
//
// 3. Assignment statement
//    Assigns a new value to an existing variable.
//    Example:
//        number = 20;
//
// 4. Expression statement
//    An expression followed by a semicolon.
//    Example:
//        number++;
//
// 5. Compound statement (block)
//    A group of statements enclosed in braces {}.
//    Example:
//        {
//            int a = 5;
//            int b = 10;
//        }
//
// 6. Selection statements (decision-making)
//    Examples:
//        if
//        if-else
//        switch
//
// 7. Iteration statements (loops)
//    Examples:
//        for
//        while
//        do-while
//
// 8. Jump statements
//    Transfer control to another part of the program.
//    Examples:
//        return
//        break
//        continue
//        goto
//
// 9. Empty statement
//    A statement that contains only a semicolon.
//    Example:
//        ;

#include <iostream>
using namespace std;

int main() {
    int num; // Declaration statement

    int number = 10; // Initialization statement

    double PI;
    PI = 3.14; // Assignment statement

    number++; // Expression statement
    number--;
    ++number;
    --number;

    // Iteration statements (loops)
    for (int i = 0; i < 10; i++) {
        // Compound (block) statements

        // Selection statements
        if (i == 5) {
            // Jump statements
            continue;
        }
        if (i == 7) {
            // Jump statements
            break;
        }
    }

    for (; number < 10;) {
        cout << "Empty loop statements" << endl;
        cout << "Infinite loop" << endl;
    }

    // Jump statements
    return 0;
}
