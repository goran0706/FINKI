// =============================================================================
// escape_sequence.cpp — Escape Sequences in C++
// =============================================================================
//
// Escape sequences are special character combinations beginning with backslash (\)
// that represent characters which cannot be typed directly or have special meaning
// in string/char literals.
//
// COMPLETE ESCAPE SEQUENCE REFERENCE:
//   \n   — newline          : moves cursor to start of next line
//   \t   — horizontal tab  : moves cursor to next tab stop
//   \v   — vertical tab    : moves cursor down one tab stop (rarely used)
//   \b   — backspace       : moves cursor one position left (does NOT delete)
//   \r   — carriage return : moves cursor to start of current line (overwrites)
//   \a   — alert/bell      : triggers audible beep or visual bell (terminal dependent)
//   \f   — form feed       : advances to next page (legacy printers, rarely used)
//   \\   — literal backslash
//   \"   — literal double quote inside a string literal
//   \'   — literal single quote inside a char literal
//   \?   — literal question mark (avoids trigraph parsing, legacy)
//   \0   — null character  : string terminator, value 0 — NOT the digit '0'
//
// NUMERIC ESCAPE SEQUENCES:
//   \ooo — octal   : character by octal value  e.g. '\101' == 'A' (octal 101 = 65)
//   \xhh — hex     : character by hex value    e.g. '\x41' == 'A' (hex 41 = 65)
//   \uhhhh         — Unicode code point (C++11, 16-bit) e.g. '\u0041' == 'A'
//   \Uhhhhhhhh     — Unicode code point (C++11, 32-bit) e.g. '\U00000041' == 'A'
//
// IMPORTANT BEHAVIORS:
//   \b (backspace) moves the cursor but does NOT erase — it only repositions.
//   Output is buffered: effects may not appear until flush or endl.
//   \a behavior is terminal-dependent — modern terminals may ignore the beep.
//   \r without \n leaves cursor at line start; next output overwrites the line.
//
// COMMON USE CASES:
//   \n           — line breaks in output (prefer over endl when no flush needed)
//   \t           — aligning tabular console output
//   \\ and \"    — embedding backslashes/quotes in file paths and messages
//   \r           — progress bars / overwrite current line in terminal UIs
//   \0           — manual C-string construction (know your buffer sizes)
//   \x / \u      — embedding specific Unicode or control characters
//
// RAW STRING LITERALS (C++11) — escape sequences are ignored:
//   R"(C:\Users\name\file.txt)"   — no need to escape backslashes
//   R"(He said "hello")"          — no need to escape quotes
//   Delimiter syntax: R"delimiter(content)delimiter" for strings containing )"
//
// =============================================================================

#include <iostream>

int main() {
    using namespace std;

    cout << "\aOperation \"HyperHype\" is now activated!\n"; // \a = bell, \" = literal quote
    cout << "Enter your agent code:________\b\b\b\b\b\b\b\b"; // \b moves cursor back 8 (no erase)

    long code;
    cin >> code;
    cout << "\aYou entered " << code << "...\n";
    cout << "\aCode verified! Proceed with Plan Z3!\n";

    //     =============================================================───────────────
    // \r — carriage return: overwrites current line from the start
    //     =============================================================───────────────
    cout << "Loading...          ";
    cout << "\rDone!              \n"; // overwrites "Loading..." in place

    //     =============================================================───────────────
    // \t — tab alignment
    //     =============================================================───────────────
    cout << "\nName\t\tScore\n";
    cout << "Alice\t\t98\n";
    cout << "Bob\t\t74\n";

    //     =============================================================───────────────
    // Raw string literal — no escaping needed (C++11)
    //     =============================================================───────────────
    cout << "\nRaw string path : " << R"(C:\Users\agent\plan_z3.txt)" << "\n";
    cout << "Raw with quotes : " << R"(He said "initiate")" << "\n";

    //     =============================================================───────────────
    // Numeric escape sequences
    //     =============================================================───────────────
    cout << "\nOctal  \\101 = " << '\101' << "\n"; // octal 101 = decimal 65 = 'A'
    cout << "Hex    \\x41 = " << '\x41' << "\n"; // hex 41    = decimal 65 = 'A'
    cout << "Unicode \\u0041 = " << "\u0041" << "\n"; // Unicode U+0041 = 'A'

    return 0;
}
