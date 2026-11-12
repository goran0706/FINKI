// =============================================================================
// input.cpp — Console Input, Stream State, and Buffer Management
// =============================================================================
//
// std::cin:
//   cin is a global object of type std::istream, defined in <iostream>.
//   >> is the extraction operator — reads data from the stream into a variable.
//   cin is type-aware: it parses input differently based on the variable's type.
//     cin >> int    — skips whitespace, reads digits, stops at non-digit
//     cin >> double — skips whitespace, reads digits and '.', stops after
//     cin >> char   — skips whitespace, reads exactly ONE character
//     cin >> char[] — skips whitespace, reads until next whitespace (single word)
//     cin >> string — same as char[], stops at whitespace
//
// HOW >> LEAVES THE BUFFER:
//   cin >> always leaves the terminating character (usually '\n') in the buffer.
//   The next read operation will see it immediately:
//     cin >> age;           // user types "25\n" — "25" consumed, '\n' stays
//     getline(cin, name);   // immediately reads the leftover '\n' as empty string
//   Fix: cin.ignore() or cin.ignore(numeric_limits<streamsize>::max(), '\n')
//
// STREAM STATE FLAGS:
//   cin has internal state flags that control whether reads succeed:
//     goodbit — everything OK, reads will proceed
//     failbit — logical error (e.g. "abc" into an int) — extraction fails, value unchanged
//     eofbit  — end of input stream reached
//     badbit  — unrecoverable I/O error
//
//   After a failed read (failbit set):
//     - All subsequent >> operations silently fail and do nothing
//     - You MUST call cin.clear() to reset the flags before reading again
//     - The bad input remains in the buffer — also clear it with cin.ignore()
//
//   Robust input loop pattern:
//     int n;
//     while (!(cin >> n)) {
//         cin.clear();
//         cin.ignore(numeric_limits<streamsize>::max(), '\n');
//         cout << "Invalid, try again: ";
//     }
//
// cin MEMBER FUNCTIONS — COMPLETE REFERENCE:
//   cin >> var                       — extract typed value, skip leading whitespace
//   cin.get(c)                       — read one char including whitespace
//   cin.get(buf, n)                  — read up to n-1 chars, stop at '\n', leave '\n' in buffer
//   cin.getline(buf, n)              — read up to n-1 chars, stop at '\n', CONSUME '\n'
//   getline(cin, str)                — read full line into std::string, consume '\n'
//   cin.peek()                       — inspect next char without extracting (returns int)
//   cin.ignore()                     — discard 1 character
//   cin.ignore(n, delim)             — discard up to n chars or until delim (consumed)
//   cin.ignore(numeric_limits        — discard everything up to and including '\n'
//             <streamsize>::max(),'\n')
//   cin.clear()                      — reset error state flags (does NOT clear buffer)
//   cin.fail()                       — true if failbit or badbit set
//   cin.eof()                        — true if eofbit set
//   cin.good()                       — true only if all flags are clear
//   cin.sync()                       — attempt to discard unread buffer (implementation-defined)
//   cin.unget()                      — push last extracted character back into buffer
//   cin.putback(c)                   — push specific character back into buffer
//
// cin.get() vs cin.getline() vs getline():
//   ┌──────────────────────────┬───────────────────────────┬───────────────┐
//   │ Method                   │ Stops at                  │ Consumes '\n' │
//   ├──────────────────────────┼───────────────────────────┼───────────────┤
//   │ cin >> arr / string      │ whitespace                │ NO            │
//   │ cin.get(buf, n)          │ '\n' or n-1 chars         │ NO            │
//   │ cin.getline(buf, n)      │ '\n' or n-1 chars         │ YES           │
//   │ getline(cin, str)        │ '\n'                      │ YES           │
//   └──────────────────────────┴───────────────────────────┴───────────────┘
//
// char[] vs std::string FOR INPUT:
//   char[]:
//     - Fixed size — must declare max size upfront, overflow = buffer overrun
//     - cin >> array  reads single word (no bounds protection — dangerous for large input)
//     - cin.getline(array, SIZE) reads full line with bounds protection
//   std::string:
//     - Dynamically sized — no overflow risk
//     - cin >> str     reads single word
//     - getline(cin, str) reads full line
//     - Preferred in all cases where C interop is not needed
//
// peek() USE CASES:
//   - Detect end of input before reading: if (cin.peek() == EOF)
//   - Branch on next character type without consuming it
//   - Lookahead in parsers
//   Returns int (not char) so EOF (-1) can be distinguished from valid chars.
//
// =============================================================================

#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Reading numbers
    // ─────────────────────────────────────────────────────────────────────────
    int age;
    double height;

    cout << "Enter your age (int): ";
    cin >> age;

    cout << "Enter your height (double): ";
    cin >> height;

    cout << "age=" << age << "  height=" << height << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Reading a single character — skips leading whitespace
    // ─────────────────────────────────────────────────────────────────────────
    char initial;
    cout << "Enter middle initial: ";
    cin >> initial;
    cout << "Initial: " << initial << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Reading a single word — cin >> stops at whitespace
    // ─────────────────────────────────────────────────────────────────────────
    constexpr int SIZE = 30;
    char firstName[SIZE];
    cout << "Enter first name (char[]): ";
    cin >> firstName;
    cout << "Hello, " << firstName << "\n";

    string lastName;
    cout << "Enter last name (string): ";
    cin >> lastName;
    cout << "Hi, " << lastName << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Reading a full line — must clear '\n' left by >> before calling getline
    // ─────────────────────────────────────────────────────────────────────────
    char address[100];
    cout << "Enter address (char[]): ";
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // clear leftover '\n'
    cin.getline(address, 100); // reads full line, consumes '\n'
    cout << "Address: " << address << "\n";

    string city;
    cout << "Enter city (string): ";
    getline(cin, city); // no ignore needed — getline consumed '\n' above
    cout << "City: " << city << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 5. peek() — inspect next char without extracting
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Type something and press Enter: ";
    int next = cin.peek(); // returns int so EOF is distinguishable
    if (next != EOF)
        cout << "Next char in buffer: '" << static_cast<char>(next) << "'\n\n";
    else
        cout << "Buffer empty (EOF)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Stream state + recovery — robust input loop
    // ─────────────────────────────────────────────────────────────────────────
    int validated;
    cout << "Enter a valid integer: ";
    while (!(cin >> validated)) {
        cin.clear(); // reset failbit — MUST do this before any further reads
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); // discard bad input
        cout << "Invalid input. Try again: ";
    }
    cout << "You entered: " << validated << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // 7. cin.get() — reads one char INCLUDING whitespace (unlike >>)
    // ─────────────────────────────────────────────────────────────────────────
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // clear buffer
    char ch;
    cout << "Press any key (including space): ";
    cin.get(ch);
    cout << "You pressed: '" << ch << "'\n";

    return 0;
}
