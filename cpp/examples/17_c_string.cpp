// =============================================================================
// c_strings.cpp — C-Style Strings, Null Terminator, and Input Methods
// =============================================================================
//
// C-STYLE STRINGS:
//   A C-style string is a char array terminated by a null character '\0' (value 0).
//   The null terminator is what makes an array of chars a "string" — without it,
//   functions like cout, strlen, strcpy have no idea where the string ends and
//   will read garbage memory until they happen to find a zero byte (UB).
//
//   char word[6] = "Hello";  // stores: ['H','e','l','l','o','\0']  — 5 chars + 1 null
//   char word[5] = "Hello";  // NO null terminator — not a valid C-string
//   char word[]  = "Hello";  // compiler infers size as 6 (includes '\0')
//
//   Manually placing '\0' anywhere truncates the visible string at that position.
//   The bytes after '\0' still exist in memory — they're just ignored by string ops.
//
// SIZE RULE — always allocate at least strlen + 1:
//   "Hello" needs 6 bytes, not 5.
//   Off-by-one here causes buffer overflows — one of the most common C/C++ bugs.
//
// STRING vs CHAR ARRAY:
//   "Hello"    — string literal, type const char*, null terminated, read-only
//   'H'        — single char literal, type char, NOT null terminated
//   char a[]   — mutable char array, local copy of the string data
//   const char* p = "Hello"  — pointer to read-only string literal (do not write to it)
//
// INPUT METHOD COMPARISON:
//   ┌─────────────────┬──────────────────────────────┬───────────────────────────┐
//   │ Method          │ Stops at                     │ Newline in buffer after?  │
//   ├─────────────────┼──────────────────────────────┼───────────────────────────┤
//   │ cin >>          │ any whitespace               │ YES — leaves it behind    │
//   │ cin.get(a, N)   │ newline or N-1 chars         │ YES — leaves '\n' behind  │
//   │ cin.getline(a,N)│ newline or N-1 chars         │ NO  — consumes '\n'       │
//   └─────────────────┴──────────────────────────────┴───────────────────────────┘
//
// BUFFER CLEARING — canonical pattern:
//   cin.ignore(numeric_limits<streamsize>::max(), '\n');
//   Use after cin >> or cin.get() before any subsequent line-based read.
//   numeric_limits<streamsize>::max() = discard up to the platform's max stream size.
//   Using INT_MAX is technically wrong — streamsize may be larger than int.
//
// cin >> DETAILS:
//   - Skips leading whitespace, then reads until next whitespace
//   - Leaves the terminating whitespace (usually '\n') in the buffer
//   - Suitable for single tokens (words, numbers) only
//
// cin.get(array, N) DETAILS:
//   - Reads up to N-1 chars, stops at '\n' but does NOT extract it
//   - Null-terminates the result automatically
//   - If called twice in a row without clearing, second call reads empty (sees '\n')
//
// cin.getline(array, N) DETAILS:
//   - Reads up to N-1 chars, stops at '\n' and DOES extract/discard the '\n'
//   - Null-terminates the result automatically
//   - Preferred over cin.get() for line input — no manual ignore() needed after
//   - If input exceeds N-1 chars, failbit is set — check cin.fail() if needed
//
// PREFER std::string FOR NEW CODE:
//   std::string handles memory automatically, no fixed size, no overflow risk.
//   Use std::getline(cin, str) for full-line input with std::string.
//   C-style char arrays are necessary for: legacy APIs, embedded/no-heap environments,
//   fixed-size buffers in protocols, interop with C libraries.
//
// COMMON PITFALLS:
//   1. Forgetting '\0' — undefined behavior when passed to any string function
//   2. Off-by-one — char name[5] = "Hello" has no room for '\0'
//   3. Mixing cin >> with cin.getline() without clearing the buffer
//   4. Using cin.get() twice without clearing — second read gets empty string
//   5. Writing to a const char* string literal — undefined behavior, often crashes
//
// =============================================================================

#include <iostream>
#include <limits>
using namespace std;

int main() {
    constexpr int SIZE = 30;

    // ─────────────────────────────────────────────────────────────────────────
    // Null terminator — marks the end of a C-style string
    // ─────────────────────────────────────────────────────────────────────────
    char word[SIZE] = "Hello Word"; // ['H','e','l','l','o',' ','W','o','r','d','\0',...]

    word[10] = '\0'; // already null-terminated here; explicitly shown for clarity
    word[5] = '\0'; // truncate early — cout now sees "Hello" only
    cout << word << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // cin >> — single token only, stops at whitespace, leaves '\n' in buffer
    // ─────────────────────────────────────────────────────────────────────────
    char singleWord[SIZE];
    cout << "Enter a single word: ";
    cin >> singleWord;
    cout << "You entered: " << singleWord << "\n\n";

    // cin >> leaves '\n' in the buffer — clear before next line-based read
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    // ─────────────────────────────────────────────────────────────────────────
    // cin.get(array, N) — reads full line, does NOT consume the trailing '\n'
    // ─────────────────────────────────────────────────────────────────────────
    char sentence[SIZE];
    cout << "Enter a sentence (cin.get): ";
    cin.get(sentence, SIZE); // '\n' stays in buffer after this
    cout << "You entered: " << sentence << "\n\n";

    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // must clear before next read

    // ─────────────────────────────────────────────────────────────────────────
    // cin.getline(array, N) — reads full line, DOES consume the trailing '\n'
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Enter a sentence (cin.getline): ";
    cin.getline(sentence, SIZE); // '\n' consumed — no ignore() needed after
    cout << "You entered: " << sentence << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Prefer std::string + std::getline for new code — no size limit, no overflow
    // ─────────────────────────────────────────────────────────────────────────
    // std::string s;
    // std::getline(cin, s);   // reads full line including spaces, no size cap

    return 0;
}
