// COMMENTS IN C++
//
// Comments are used to explain code and improve readability.
// They are ignored by the compiler and do not affect program execution.
//
// C++ supports two types of comments:
//
// 1. Single-line comments
//    - Begin with //
//    - Continue until the end of the line
//
// 2. Multi-line (block) comments
//    - Begin with /*
//    - End with */
//
// Tips:
// - Use comments to explain WHY something is done, not just WHAT the code does.
// - Prefer // comments in modern C++.
// - Block comments cannot be nested.
//
// You should use comments to document your programs. The more complex the program, the more valuable comments are.
// Not only do they help others to understand what you have done, but also they help you understand what you’ve done,
// especially if you haven’t looked at the program for a while.

#include <iostream>

int main() {
    // Example 1: single-line comment
    // This comment explains the next line of code

    // Example 2: multi-line comment
    /*
       This comment spans
       multiple lines
       and is useful for longer explanations
    */

    // Example 3: comments can appear inside statements
    constexpr int /* inline comment */ number = 10;

    std::cout << number << std::endl;

    return 0;
}
