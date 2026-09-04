// =============================================================================
// cli_io.cpp — Console Input and Output (cin / cout / cerr / clog)
// =============================================================================
//
//   CLI I/O = Command Line Interface Input/Output
//
//   C++ uses stream objects from <iostream> for console communication.
//
//     cout  → standard output stream
//     cin   → standard input stream
//     cerr  → standard error stream (unbuffered)
//     clog  → logging stream (buffered error output)
//
//   Header required:
//     #include <iostream>
//
// ─────────────────────────────────────────────────────────────────────────
// BASIC OUTPUT — cout
// ─────────────────────────────────────────────────────────────────────────
//
//   cout sends data to the console.
//
//     cout << "Hello\n";
//     cout << value;
//
//   Operator used:
//     <<   (insertion operator)
//
//   Multiple values can be chained:
//
//     cout << "Value: " << x << "\n";
//
// ─────────────────────────────────────────────────────────────────────────
// BASIC INPUT — cin
// ─────────────────────────────────────────────────────────────────────────
//
//   cin reads data from keyboard input.
//
//     cin >> x;
//
//   Operator used:
//     >>   (extraction operator)
//
//   Multiple inputs:
//
//     cin >> a >> b;
//
// ─────────────────────────────────────────────────────────────────────────
// WHITESPACE BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────
//
//   cin >> value
//     • skips whitespace
//     • stops reading at whitespace
//
//   Example:
//
//     string name;
//     cin >> name;
//
//   Input:
//     John Smith
//
//   Result:
//     name = "John"
//
//   To read full lines use:
//
//     getline(cin, string)
//
// ─────────────────────────────────────────────────────────────────────────
// BUFFERING
// ─────────────────────────────────────────────────────────────────────────
//
//   cout is buffered — output may wait before appearing.
//
//   endl forces flush:
//
//     cout << "Hello" << endl;
//
//   '\n' is faster and preferred:
//
//     cout << "Hello\n";
//
// ─────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────
//
//   If invalid input occurs:
//
//     int x;
//     cin >> x;   // user enters "abc"
//
//   cin enters fail state.
//
//   Reset using:
//
//     cin.clear();
//     cin.ignore(...);
//
// ─────────────────────────────────────────────────────────────────────────
// STREAM STATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────
//
//   cin.good()   → no errors
//   cin.fail()   → input failed
//   cin.bad()    → serious error
//   cin.eof()    → end-of-file reached
//
// ─────────────────────────────────────────────────────────────────────────
// REDIRECTION (OS FEATURE)
//
//   program < input.txt
//   program > output.txt
//
//   cin reads from file
//   cout writes to file
//
// =============================================================================

#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Basic output
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Basic cout ===\n";

    cout << "Hello, world\n";

    int x = 10;
    double pi = 3.14159;

    cout << "x = " << x << "\n";
    cout << "pi = " << pi << "\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Basic input
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Basic cin ===\n";

    int age;

    cout << "Enter your age: ";
    cin >> age;

    cout << "You entered: " << age << "\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Multiple input values
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Multiple inputs ===\n";

    int a, b;

    cout << "Enter two integers: ";
    cin >> a >> b;

    cout << "Sum = " << a + b << "\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Reading a full line
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== getline ===\n";

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string name;

    cout << "Enter your full name: ";
    getline(cin, name);

    cout << "Hello " << name << "\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Handling input errors
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Input error handling ===\n";

    int number;

    cout << "Enter an integer: ";
    cin >> number;

    if (cin.fail()) {
        cout << "Invalid input detected\n";

        cin.clear(); // reset error state
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); // discard bad input
    } else {
        cout << "Valid number: " << number << "\n";
    }

    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // cerr and clog
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== cerr / clog ===\n";

    cerr << "This is an error message\n";
    clog << "This is a log message\n";

    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Looping input until EOF
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Reading until EOF ===\n";
    cout << "Enter numbers (Ctrl+D to stop):\n";

    int value;

    while (cin >> value) {
        cout << "Read: " << value << "\n";
    }

    return 0;
}

// =============================================================================
// SUMMARY
// =============================================================================
//
//   OUTPUT
//      cout << value;
//
//   INPUT
//      cin >> value;
//
//   LINE INPUT
//      getline(cin, string)
//
//   ERROR OUTPUT
//      cerr << message;
//
//   LOG OUTPUT
//      clog << message;
//
//   CLEAR INPUT ERROR
//      cin.clear();
//      cin.ignore(...);
//
// =============================================================================
