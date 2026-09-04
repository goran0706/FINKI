/*
 * ----------------------------------------------
 * C++ Paradigms
 * ----------------------------------------------
 * C++ join 3 programming paradigms (methodologies):
 *  1. Procedural programming - represented by C.
 *  2. Object-oriented programming - represented by C++ class enhancements.
 *  3. Generic programming - represented by C++ template features.
 *
 *
 * ----------------------------------------------
 * History
 * ----------------------------------------------
 * In the 1970s, Dennis Ritchie of Bell Labs was working on a project to develop the Unix operating system.
 * For this work he needed a language that was concise, that produced compact, fast programs, and that could control hardware efficiently.
 * Traditionally, programmers used assembly language, but assembly is a low-level language, it works directly with the hardware.
 * But Unix was intended to work on many computer types and platforms (platform-agnostic), which suggested a high-level language.
 * A high-level language is oriented towards problem-solving instead of specific hardware.
 * Special programs called compilers translate the high-level code to machine code, understandable to computer.
 * So building from older languages, he created C.
 *
 * Like C, C++ began its life at Bell Labs, where Bjarne Stroustrup developed the language in the early 1980s.
 * Its main purpose was to make writing good programs easier and more pleasant for the individual programmer.
 * Stroustrup based C++ on C, and added OOP features and generic programming support without significantly changing C.
 * Thus C++ is a superset of C, meaning that any valid C program is a valid C++ program, too. C++ programs can use
 * existing C software libraries. Libraries are collections of programming modules that you can call up from a program.
 * They provide proven solutions to many common programming problems, thus saving you much time and effort.
 * The name C++ comes from the C increment operator ++, which adds one to the value of a variable.
 * Therefore, the name C++ correctly suggests an augmented version of C.
 *
 *
 * ----------------------------------------------
 * Operating System
 * ----------------------------------------------
 * An operating system is a set of programs that manages a computer's resources and handles its interactions with users.
 *
 *
 * ----------------------------------------------
 * C Programming Philosophy
 * ----------------------------------------------
 * Computer languages deal with two concepts: data & algorithms.
 * - Data is the information a program uses and processes.
 * - Algorithms are the methods (actions) a computer takes to manipulate data and solve a problem.
 *
 * C is procedural language, procedural programming consists of figuring out the actions a computer should take and
 * then using the programming language to implement those actions.
 *
 * A program prescribes a set of procedures for the computer to follow to produce a particular outcome.
 * Programs often use branching statements, which route to execute or set of instructions based on some condition,
 * this created messi "spaghetti programming". So computer scientists created a more disciplined style of programming
 * called structural programming. C incorporates these constructions (for, while, do while, if else statements).
 *
 * "Top-down design", the idea is to break a large program into smaller, more manageable tasks.
 * If a task is still too broad, we divide it into yet smaller tasks.
 * C design's encourage to develop program units called functions to represent individual task modules.
 *
 *
 * ----------------------------------------------
 * C++ Object-oriented Programming Philosophy
 * ----------------------------------------------
 * Unlike procedural programming, which emphasizes algorithms, OOP emphasizes the data.
 * The idea is to design data forms that correspond to the essential features of a problem.
 * In C++ a class defines what data is used to represent an object and the operations that can be performed on that data.
 * The class is the blueprint for creating objects.
 *
 * The OOP approach to program design is to first design classes that accurately represent those things with which the program deals.
 * Then proceed to design a program, using objects of those classes. The process of going from a lower level of organization,
 * such as classes, to a higher level, such as program design, is called "bottom-up programming".
 *
 * Instead of concentrating on tasks, we concentrate on representing concepts.
 * Instead of taking a top-down programming approach, we take a bottom-up approach.
 *
 *
 * ----------------------------------------------
 * C++ Generic Programming Philosophy
 * ----------------------------------------------
 * Generic programming is another programming paradigm, that together with OOP aims of making it simple to reuse code
 * and the technique of abstracting general concepts. But where OOP emphasizes the data aspect of programming,
 * generic programming emphasizes the independence from a particular data type. The term generic refers to code that is
 * type independent. C++ provides tools for performing common tasks that can be reused if were type independent, so that
 * we can write functions for a generic type once and use it for a variety of actual types.
 *
 * C++ templates provide a mechanism for doing that. It's main focus is to provide data independence and code reusability.
 *
 *
 * ----------------------------------------------
 * Portability
 * ----------------------------------------------
 * If you can recompile the program without making changes, and it runs without a hitch, we say the program is portable.
 * Instead of using low-level assembler and rewrite code for every different platform, we use a high-level language and
 * recompile the source code into an executable code using a compiler specific to certain platform.
 *
 *
 * ----------------------------------------------
 * Summary
 * ----------------------------------------------
 * - C heritage provides low-level hardware access.
 * - C procedural and structural programming heritage provide traditional writing code focusing on algorithms to solve a problem.
 * - C++ Object-oriented programming heritage provides a high-level of abstraction and reusability.
 * - C++ Generic programming heritage provides type independence and reusability.
 *
 *
 * ----------------------------------------------
 * The Mechanics of Creating a Program:
 * ----------------------------------------------
 *
 * | Source Code | -> COMPILER -> | Object Code + (Startup Code & Library Code) | -> LINKER -> | Executable Code |
 *
 */

// This directive causes the preprocessor to add the contents of the iostream file to your program.
// Programs that use cin and cout for input and output must include the iostream file.
#include <iostream> // a PREPROCESSOR directive

// Use using directive to make the definitions in iostream available to our program:
using namespace std; // a using directive

// Function Declaration - Function Prototype
void sayHello();

/*
    Each program must have a main function.
    The startup code uses this function in order to execute and run our program.
    The main function must specify an int return type. The function then should return an int value.
    If the return value is omitted the C++ compiler implicitly adds a return value.
    The compiler does not include a return value for other user defined functions.
*/
int main() {
    // Output stream object - a stream of characters flowing out of the program to display in standard output.
    cout << "Enter your name:_ "; // << operator shows the direction flow of the charter stream, used to output data.

    // Input stream object - a stream of characters flowing into the problem from the standard input.
    char name[30];
    cin >> name; // >> operator used to extract data from the standard input (keyboard) into a variable.
    cout << "Hello, " << name << endl; // << operator used to output data to the standard output (CLI).

    sayHello();

    return 0;
}

/*
    User-defined Function

    Parts of a function:

    1. Function Header (as function interface)
       Consists of:
       - Return type
       - Function name
       - Parameter list (types and optional names)

    2. Function Body (as function implementation)
       Consists of:
       - A code block enclosed in {}
       - The implementation (set of instructions executed when the function is called)
       - An optional return statement that returns a value to the caller

    In C++, a user-defined function must appear before the function that calls it, or it must be declared before it is used.
    This is because the compiler reads the source code from top to bottom.
    The compiler must know that a function exists before it encounters a call to it.
    Therefore, the compiler must see a declaration before the function is called.

    A declaration can be either:
        - The full function definition, or
        - A function prototype

    A function prototype informs the compiler about the function's name, return type, and parameters before its actual definition.
    In many C++ programs, prototypes are placed above main(), while the full function definitions appear below main().

    Function Definition bellow:
*/
void sayHello() {
    cout << "Hello C++" << endl;
}
