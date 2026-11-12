// =============================================================================
// std_string.cpp — std::string, References, Input, and String Operations
// =============================================================================
//
// std::string vs C-STYLE STRINGS:
//   std::string is a class (from <string>) that manages its own heap memory.
//   Unlike char arrays it has no fixed size, no null terminator to manage,
//   no buffer overflow risk, and grows/shrinks automatically.
//
//   char name[30] = "Alice";  — fixed size, manual, overflow possible
//   std::string name = "Alice"; — dynamic, safe, preferred in modern C++
//
//   Internally std::string still stores a null terminator for C interop,
//   accessible via name.c_str() — returns const char* for use with C APIs.
//
// CONSTRUCTION:
//   string s1 = "Hello";          // copy-init from string literal
//   string s2("Hello");           // direct-init
//   string s3(s1);                // copy constructor
//   string s4(5, 'x');            // "xxxxx" — fill constructor
//   string s5 = s1 + " World";    // concatenation into new string
//   string s6(s1, 1, 3);          // substring: s1[1..3] = "ell"
//
// REFERENCES — avoid unnecessary copies:
//   const string& ref = s1;   — ref is an alias to s1, no heap allocation
//   string copy = s1;         — copy constructor, allocates new memory
//   Use const& for read-only access to strings in functions:
//     void print(const string& s)  — zero copy, safe
//     void print(string s)         — always copies, avoid unless mutation needed
//
// MOVE SEMANTICS (C++11):
//   string s2 = std::move(s1);   — transfers ownership, s1 is left empty
//   Prefer move over copy when passing temporaries or transferring ownership.
//   Return by value is optimized via RVO/NRVO — no manual move needed on return.
//
// CONCATENATION:
//   s1 + s2          — creates new string (heap allocation per +)
//   s1 += s2         — appends in-place, more efficient
//   s1.append(s2)    — same as +=, chainable
//   Avoid chained + in loops — each + allocates; use += or append() instead.
//
// INPUT METHODS:
//   cin >> s         — reads one token (stops at whitespace), leaves '\n' in buffer
//   getline(cin, s)  — reads full line including spaces, consumes '\n'
//   Mix carefully: cin >> followed by getline needs cin.ignore() to clear the '\n'.
//
// KEY MEMBER FUNCTIONS:
//   s.size()          — number of chars (same as length(), prefer size() for consistency)
//   s.empty()         — true if size() == 0, prefer over s.size() == 0
//   s.clear()         — empties the string
//   s.substr(pos, n)  — returns new string: n chars starting at pos
//   s.find(str)       — first occurrence index, or string::npos if not found
//   s.rfind(str)      — last occurrence
//   s.replace(pos,n,str) — replaces n chars at pos with str
//   s.erase(pos, n)   — removes n chars starting at pos
//   s.insert(pos, str)— inserts str at pos
//   s.at(i)           — bounds-checked access, throws std::out_of_range
//   s[i]              — unchecked access, UB if out of range
//   s.front() / s.back() — first/last char
//   s.c_str()         — const char* for C API interop
//   s.assign(str)     — replaces content (same as = but chainable)
//   s.append(str)     — appends (same as += but chainable)
//
// compare() RETURN VALUES:
//   0   — strings are equal
//   < 0 — calling string is lexicographically less than argument
//   > 0 — calling string is lexicographically greater than argument
//   Lexicographic = character-by-character ASCII value comparison.
//   Prefer == / < / > operators for simple equality/ordering — more readable.
//   Use compare() when you need the signed delta (e.g. sorting, custom comparators).
//
// string::npos:
//   Returned by find()/rfind() when no match is found.
//   Type is size_t (unsigned). Never compare against -1 or signed int:
//     if (s.find("x") == string::npos) { /* not found */ }  // correct
//     if (s.find("x") == -1)           { /* wrong     */ }  // signed/unsigned mismatch
//
// PERFORMANCE NOTES:
//   - Reserve capacity upfront when building large strings: s.reserve(1024)
//   - string_view (C++17) for read-only string references with zero allocation:
//       void parse(std::string_view sv)  — works with string, char*, literals
//   - std::ostringstream or fmt/std::format (C++20) for complex string building
//
// =============================================================================

#include <iostream>
#include <limits>
#include <string>
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // Construction and reference vs copy
    // ─────────────────────────────────────────────────────────────────────────
    const string s1 = "Hello World";
    const string &s2 = s1; // alias — no copy, no allocation
    // const string s2 = s1; // this would copy — new heap allocation

    cout << s1 << "\n";
    cout << s2 << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Concatenation — + creates new string, += appends in-place
    // ─────────────────────────────────────────────────────────────────────────
    cout << s2 + '!' << "\n"; // char appended
    cout << s2 + "!" << "\n"; // string literal appended

    string built;
    built.reserve(32); // avoid repeated reallocations
    built += s1;
    built += " — appended in-place"; // efficient: no intermediate allocation
    cout << built << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Single-token input — cin >> stops at whitespace, leaves '\n' in buffer
    // ─────────────────────────────────────────────────────────────────────────
    string firstName, lastName;
    cout << "Enter first name: ";
    cin >> firstName;
    cout << "Enter last name: ";
    cin >> lastName;
    cout << "Hello, " + firstName + " " + lastName + "\n\n";

    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // clear '\n' before getline

    // ─────────────────────────────────────────────────────────────────────────
    // Full-line input — getline reads spaces, consumes '\n'
    // ─────────────────────────────────────────────────────────────────────────
    string fullName;
    cout << "Enter full name: ";
    getline(cin, fullName);
    cout << "Hello, " + fullName + "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Key member functions
    // ─────────────────────────────────────────────────────────────────────────
    cout << "size()   : " << fullName.size() << "\n";
    cout << "empty()  : " << fullName.empty() << "\n";
    cout << "front()  : " << fullName.front() << "\n";
    cout << "back()   : " << fullName.back() << "\n";
    cout << "at(0)    : " << fullName.at(0) << "  (bounds-checked, throws if OOB)\n";
    cout << "substr   : " << fullName.substr(0, 5) << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // assign() / append() — chainable replacements for = and +=
    // ─────────────────────────────────────────────────────────────────────────
    fullName.assign(firstName).append(" ").append(lastName);
    cout << "assign+append: " << fullName << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // find() — returns index or string::npos if not found
    // ─────────────────────────────────────────────────────────────────────────
    size_t pos = s1.find("World");
    if (pos != string::npos)
        cout << "Found \"World\" at index: " << pos << "\n";
    else
        cout << "Not found\n";

    // ─────────────────────────────────────────────────────────────────────────
    // compare() — signed delta for ordering/sorting
    // Prefer == / < / > for simple equality checks
    // ─────────────────────────────────────────────────────────────────────────
    cout << "\ncompare s1 vs s2 : " << s1.compare(s2) << "  (0 = equal)\n";
    cout << "s1 == s2         : " << (s1 == s2) << "  (cleaner for equality)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // C interop — c_str() for passing to C APIs
    // ─────────────────────────────────────────────────────────────────────────
    const char *cptr = fullName.c_str(); // valid as long as fullName is not modified
    cout << "c_str(): " << cptr << "\n";

    return 0;
}
