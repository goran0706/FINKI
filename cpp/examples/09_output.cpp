// =============================================================================
// output.cpp — Console Output, Formatting, and Stream Manipulators
// =============================================================================
//
// std::cout:
//   cout is a global object of type std::ostream, defined in <iostream>.
//   cout is type-aware: it calls the correct overload of << based on the type.
//   << is the insertion operator — sends data to the stream.
//
//   Chaining works because << returns a reference to the stream itself:
//   cout << "a" << "b" << "c";  — each << returns cout, enabling the next <<
//
//
// =============================================================================
// ⚠️  '\n'  vs  endl  — READ THIS. IT MATTERS.
// =============================================================================
//
// This is one of the most common C++ habits that silently hurts performance.
// If you've been writing << endl everywhere, stop — switch to '\n'.
//
// WHAT THEY ACTUALLY DO:
//
//   cout << '\n';           — writes one newline character. Done.
//   cout << endl;           — writes one newline character, THEN forces a buffer flush.
//
//   endl is literally equivalent to: cout << '\n' << std::flush;
//
// WHAT IS A FLUSH?
//   cout is buffered — output is held in memory and written to the terminal in
//   batches for efficiency. A flush forces the OS to drain that buffer RIGHT NOW.
//   Flushing is expensive because it's a system call — crossing from user space
//   into the OS kernel. Fine to do occasionally, painful in a loop.
//
// WHY THIS MATTERS IN PRACTICE:
//
//   // ❌ Slow — flushes 1,000,000 times, 1,000,000 system calls
//   for (int i = 0; i < 1000000; i++)
//       cout << i << endl;
//
//   // ✅ Fast — flushes when the buffer fills (a handful of times total)
//   for (int i = 0; i < 1000000; i++)
//       cout << i << '\n';
//
//   The difference can be 10x–50x slower with endl in tight output loops.
//   For tiny programs it won't matter visibly. As a habit, it absolutely does.
//
// THE CORRECT USES OF endl (or explicit flush):
//
//   1. Before blocking on user input — guarantees the prompt is visible:
//        cout << "Enter your name: " << endl;
//        cin >> name;
//
//      Note: cout and cin are "tied" by default so cin auto-flushes cout before reading.
//      endl is technically redundant here, but not wrong.
//
//   2. Debugging a crash — '\n' might still be in the buffer when the program dies.
//      endl ensures you actually see the line: cout << "Reached checkpoint 3" << endl;
//
//   3. Writing to a file or pipe you're about to hand off:
//        logFile << "Done." << endl;
//
// PREFERRED STYLE IN MODERN C++:
//
//   cout << something << '\n';            ✅ default — always prefer this
//   cout << something << "\n";            ✅ also fine (string vs char, negligible)
//   cout << something << endl;            ⚠️  only when you need a flush
//   cout << something << '\n' << flush;   ✅ best when you DO need a flush — makes the intent explicit and visible
//
// cerr (standard error stream):
//   cerr is UNBUFFERED by default — always flushes immediately without endl.
//   Use cerr for error messages, not cout.
//     cerr << "Error: file not found\n";  // flushes automatically
//
// QUICK REFERENCE:
//
//   '\n'   →  newline only               fast    ✅ use this by default
//   endl   →  newline + flush            slow    ⚠️  only when flush is needed
//   flush  →  flush only (no newline)            use explicitly when intent is clear
//   cerr   →  unbuffered, always flushes         use for errors
//
// =============================================================================
//
// TYPE-AWARE OUTPUT:
//   cout handles each type differently via operator<< overloads:
//     int    → prints decimal digits
//     char   → prints the CHARACTER (not the ASCII number)
//     char*  → prints the entire C-string (not the address)
//     void*  → prints the address in hex (cast char* to void* to print its address)
//   Explicit cast changes how cout interprets the value:
//     cout << char(65)  — prints 'A'
//     cout << int('A')  — prints 65
//
// OUTPUT BUFFER:
//   cout is buffered — output may not appear immediately until:
//     - buffer is full
//     - endl or flush is called: cout << flush;
//     - program exits normally (buffer is flushed on exit)
//     - cin is read (cout and cin are tied by default)
//
// NUMBER BASE MANIPULATORS (sticky — persist until changed):
//   std::dec  — decimal (default)
//   std::hex  — hexadecimal (lowercase: ff, uppercase with std::uppercase: FF)
//   std::oct  — octal
//   std::showbase — prefix output: 0x for hex, 0 for oct
//   These are STICKY — once set, they apply to all subsequent output until reset.
//   Always reset to std::dec after hex/oct output to avoid surprising later output.
//
// FLOATING POINT MANIPULATORS (<iomanip>):
//   std::fixed          — fixed decimal notation (e.g. 3.14)
//   std::scientific     — scientific notation (e.g. 3.14e+00)
//   std::defaultfloat   — restore default (C++11)
//   std::setprecision(n)— significant digits (default) or decimal places (with fixed)
//   These are also sticky — persist until changed.
//
// FIELD WIDTH AND FILL (<iomanip>):
//   std::setw(n)        — minimum field width for the NEXT value only (NOT sticky)
//   std::setfill(c)     — fill character for padding (sticky, default is space)
//   std::left           — left-align within field width (sticky)
//   std::right          — right-align (default, sticky)
//   setw resets after each use — must be repeated for each value that needs padding.
//
// STICKY vs NON-STICKY MANIPULATORS:
//   Sticky (persist):    hex, oct, dec, fixed, scientific, setprecision, setfill,
//                        left, right, showbase, uppercase, boolalpha
//   Non-sticky (once):   setw — only applies to the immediately following output
//
// using DECLARATIONS:
//   using std::cout;  — import specific name into current scope
//   using namespace std; — imports everything (convenient but pollutes namespace)
//   In headers: NEVER use using namespace std — it forces it on every includer.
//   In .cpp files: fine at function scope; use at file scope with caution.
//
// =============================================================================

#include <iomanip>
#include <iostream>

int main() {
    using std::cout;
    using std::endl;
    using std::fixed;
    using std::setfill;
    using std::setprecision;
    using std::setw;

    // ─────────────────────────────────────────────────────────────────────────
    // '\n' vs endl — demonstrated
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Using '\\n' (preferred):\n";           // ✅ fast — no flush
    cout << "Using endl (only if needed)" << endl;  // ⚠️  flushes the buffer
    // The performance gap is invisible for small output like this.
    // It compounds badly in loops or any high-frequency output.

    // When you genuinely need a flush, make the intent explicit:
    cout << "Explicit flush when needed\n" << std::flush; // ✅ clear intent
    cout << '\n';


    // ─────────────────────────────────────────────────────────────────────────
    // Basic output and newlines
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Hello World\n";
    cout << "New line via \\n\n";
    cout << "Prefer '\\n' over endl unless you need a flush\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Chaining — << returns the stream, enabling multiple values per statement
    // ─────────────────────────────────────────────────────────────────────────
    cout << "This " << "is " << "a " << "single " << "statement.\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Type-aware output — same value, different type, different output
    // ─────────────────────────────────────────────────────────────────────────
    cout << "int 65     : " << 65 << "\n"; // 65
    cout << "char 65    : " << char(65) << "\n"; // A
    cout << "int 'A'    : " << int('A') << "\n"; // 65
    cout << "double     : " << 3.14 << "\n\n";

    // char* prints the string, not the address — cast to void* to see the address
    const char *str = "hello";
    cout << "char*      : " << str << "\n"; // hello
    cout << "as address : " << (void *) str << "\n\n"; // 0x...


    // ─────────────────────────────────────────────────────────────────────────
    // Escape sequences
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Tab        : \tColumn2\n";
    cout << "Quote      : \"Hello\"\n";
    cout << "Backslash  : \\\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Number bases — STICKY, reset to dec after use
    // ─────────────────────────────────────────────────────────────────────────
    int number = 1234;
    cout << std::showbase;
    cout << "dec : " << std::dec << number << "\n"; // 1234
    cout << "hex : " << std::hex << number << "\n"; // 0x4d2
    cout << "oct : " << std::oct << number << "\n"; // 02322
    cout << std::dec << std::noshowbase; // ← ALWAYS reset after hex/oct
    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // Floating point precision — fixed + setprecision (both sticky)
    // ─────────────────────────────────────────────────────────────────────────
    double pi = 3.1415926535;
    cout << fixed << setprecision(2) << pi << "\n"; // 3.14
    cout << fixed << setprecision(4) << pi << "\n"; // 3.1416
    cout << fixed << setprecision(6) << pi << "\n"; // 3.141593
    cout << std::defaultfloat; // ← reset float format
    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // setw + setfill — clock display (setw is non-sticky, must repeat each value)
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Clock output (setfill='0', setw=2):\n";
    for (int s = 0; s < 6; s++) {
        cout << setfill('0')
                << setw(2) << 0 << ":"
                << setw(2) << 0 << ":"
                << setw(2) << s << "\n"; // ✅ '\n' in a loop — never endl here
    }
    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // setw with text — right-align (default) and left-align
    // ─────────────────────────────────────────────────────────────────────────
    cout << "Column alignment:\n";
    cout << std::right;
    cout << setw(12) << "Name" << setw(8) << "Score" << "\n";
    cout << setw(12) << "Alice" << setw(8) << 98 << "\n";
    cout << setw(12) << "Bob" << setw(8) << 74 << "\n";

    return 0;
}
