// =============================================================================
// branching.cpp — if/else, switch, Ternary, and Conditional Operators
// =============================================================================
//
// BRANCHING TYPES:
//   if / else if / else  — general purpose, any condition, any type
//   switch               — multi-way branch on integral/enum value, cleaner than long if-else chains
//   ternary ?:           — inline conditional expression, single value result
//   short-circuit &&/||  — conditional execution as a side effect of logical operators
//
// ── if / else ───────────────────────────────────────────────────────────────
//   if (condition) { }
//   else if (condition) { }
//   else { }
//
//   condition is any expression that converts to bool:
//     0, nullptr, 0.0, '\0'  → false
//     anything else          → true
//   Braces are optional for single-statement bodies — always use them anyway.
//   Omitting braces is a common source of bugs:
//     if (x > 0)
//         x++;
//         y++;   // ALWAYS executes — NOT part of the if, despite indentation
//
//   DANGLING ELSE — else binds to the nearest if:
//     if (a)
//         if (b) doX();
//         else   doY();   // this else belongs to "if (b)", not "if (a)"
//   Always use braces to make the association explicit.
//
//   ASSIGNMENT IN CONDITION — intentional but easy to misread:
//     if (int c = getValue(); c > 0) { }  // C++17 init-statement in if
//     while ((c = getchar()) != EOF) { }  // classic C pattern
//   Compilers warn on if (x = y) vs if (x == y) — don't silence this warning.
//
// ── switch ──────────────────────────────────────────────────────────────────
//   switch (expression) {
//       case value: ...  break;
//       case value: ...  break;
//       default:    ...
//   }
//
//   expression must be integral type or enum (not float, not string).
//   case values must be compile-time integer constants.
//   FALLTHROUGH — if you omit break, execution continues into the next case:
//     case 1:
//     case 2: doSomething(); break;  // intentional fallthrough: 1 and 2 both hit this
//   Unintentional fallthrough is a very common bug — always break or comment [[fallthrough]].
//   C++17: [[fallthrough]] attribute documents intentional fallthrough, suppresses warnings.
//   default is optional but recommended — catches unexpected values.
//   Variables cannot be declared inside case labels without a block:
//     case 1: int x = 5; break;       // ERROR — jumps over initialization
//     case 1: { int x = 5; break; }   // OK — scoped block
//
// ── TERNARY OPERATOR ?: ──────────────────────────────────────────────────────
//   condition ? value_if_true : value_if_false
//
//   An EXPRESSION — produces a value, can be used inline.
//   Both branches must produce the same (or compatible) type.
//   Use for simple single-value decisions — not as a replacement for if/else blocks.
//     int abs = (x >= 0) ? x : -x;    // good
//     (a > b) ? doX() : doY();         // works but prefer if/else for side effects
//   Nested ternaries are legal but almost always unreadable — avoid.
//
// ── SHORT-CIRCUIT EVALUATION ─────────────────────────────────────────────────
//   && — evaluates right side ONLY if left side is true
//   || — evaluates right side ONLY if left side is false
//
//   if (ptr != nullptr && ptr->value > 0)   — safe: right side not reached if ptr is null
//   if (cache != nullptr || (cache = load())) — || can trigger initialization as a side effect
//
//   Order matters — put the cheapest / most likely to short-circuit condition first.
//   Do NOT rely on side effects in the right operand unless the intent is crystal clear.
//
// ── C++17 if WITH INIT-STATEMENT ─────────────────────────────────────────────
//   if (init; condition) { }
//   Variable declared in init is scoped to the if/else block only:
//     if (auto it = map.find(key); it != map.end()) {
//         use(it->second);
//     }
//   Keeps the enclosing scope clean — no leaked loop/temp variables.
//
// ── std::optional AND BRANCHING (C++17) ──────────────────────────────────────
//   Functions that may or may not return a value should return optional<T>:
//     optional<int> findIndex(...);
//     if (auto idx = findIndex(v, x); idx.has_value()) {
//         use(idx.value());
//     }
//   Cleaner than sentinel values (-1, nullptr, INT_MAX) for "no result".
//
// ── JUMP STATEMENTS ──────────────────────────────────────────────────────────
//   break     — exits the nearest loop or switch
//   continue  — skips the rest of the current loop iteration
//   return    — exits the current function and optionally returns a value
//   goto      — jumps to a labeled statement (rarely recommended)
//
//   These alter normal control flow and must be used carefully.
//
// COMMON BUGS:
//   = vs ==       : if (x = 5)  assigns 5 and is always true — should be if (x == 5)
//   Missing break : fallthrough in switch corrupts logic silently
//   Dangling else : ambiguous else binding without braces
//   Float compare : never use == with floats in conditions (use epsilon tolerance)
//   Unsigned < 0  : if (unsigned_var < 0) is always false — compiler may not warn
//
// =============================================================================

#include <iostream>
#include <string>
#include <optional>
using namespace std;

// Helper for optional example
optional<string> getGrade(int score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    if (score >= 0) return "F";
    return nullopt; // invalid score
}

int demoReturn() {
    cout << "demoReturn called\n";
    return 42; // return exits the function immediately
}

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // if / else if / else
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== if / else ===\n";
    int score = 85;

    if (score >= 90) {
        cout << "Grade: A\n";
    } else if (score >= 80) {
        cout << "Grade: B\n"; // this branch
    } else if (score >= 70) {
        cout << "Grade: C\n";
    } else {
        cout << "Grade: F\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Dangling else — braces remove ambiguity
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== dangling else (with braces) ===\n";
    int a = 1, b = 0;
    if (a) {
        if (b) {
            cout << "a and b\n";
        } else {
            cout << "a but not b\n";
        }
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // C++17 if with init-statement — scoped variable
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== C++17 if init-statement ===\n";
    if (int result = score - 70; result >= 0) {
        cout << "Passed by " << result << " points\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // switch
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== switch ===\n";
    int day = 3;
    switch (day) {
        case 1: cout << "Monday\n";
            break;
        case 2: cout << "Tuesday\n";
            break;
        case 3: cout << "Wednesday\n";
            break;
        case 4: cout << "Thursday\n";
            break;
        case 5: cout << "Friday\n";
            break;
        case 6: [[fallthrough]];
        case 7: cout << "Weekend\n";
            break;
        default: cout << "Invalid\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // switch on enum class
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== switch on enum class ===\n";
    enum class Direction { NORTH, SOUTH, EAST, WEST };
    Direction dir = Direction::NORTH;

    switch (dir) {
        case Direction::NORTH: cout << "Going north\n";
            break;
        case Direction::SOUTH: cout << "Going south\n";
            break;
        case Direction::EAST: cout << "Going east\n";
            break;
        case Direction::WEST: cout << "Going west\n";
            break;
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Ternary operator
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== ternary ===\n";
    int x = -5;
    int absVal = (x >= 0) ? x : -x;
    cout << "abs(" << x << ") = " << absVal << "\n";

    string label = (score >= 70) ? "Pass" : "Fail";
    cout << "Result: " << label << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Short-circuit evaluation
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== short-circuit ===\n";
    int *ptr = nullptr;

    if (ptr != nullptr && *ptr > 0) {
        cout << "value: " << *ptr << "\n";
    } else {
        cout << "ptr is null — right side not evaluated\n";
    }

    bool loaded = false;
    if (loaded || (loaded = true)) {
        cout << "loaded is now: " << loaded << "\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // break and continue in loops
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== break / continue ===\n";
    for (int i = 0; i < 5; i++) {
        if (i == 3) break;
        cout << i << " ";
    }
    cout << "\n";

    for (int i = 0; i < 5; i++) {
        if (i == 2) continue;
        cout << i << " ";
    }
    cout << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // return example
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== return ===\n";
    int value = demoReturn();
    cout << "returned: " << value << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // goto example (generally discouraged)
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== goto ===\n";
    int counter = 0;

start:
    cout << "counter = " << counter << "\n";
    counter++;

    if (counter < 3)
        goto start;

    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // optional example
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== optional ===\n";
    if (auto grade = getGrade(score); grade.has_value()) {
        cout << "Grade for " << score << ": " << grade.value() << "\n";
    }
    if (auto grade = getGrade(-1); !grade.has_value()) {
        cout << "Invalid score — no grade returned\n";
    }

    return 0;
}
