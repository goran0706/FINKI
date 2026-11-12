#include <iostream>
#include <iomanip>   // for setprecision
#include <cmath>     // for pow
#include <limits>    // for numeric_limits
using namespace std;

int main() {
    double a = 10.00;
    double b = 5.00;
    constexpr int ZERO = 0;

    //     =============================================================───────────────
    // Basic arithmetic
    //     =============================================================───────────────
    cout << "a + b = " << a + b << endl;
    cout << "a - b = " << a - b << endl;
    cout << "a * b = " << a * b << endl;

    cout << "a / b = " << a / b << endl;
    cout << "a / ZERO = " << a / ZERO << " (infinity for floating point)" << endl;

    // Cannot use modulus % with doubles
    // cout << "a % b = " << a % b << endl; // error

    //     =============================================================───────────────
    // Important reminders:
    //     =============================================================───────────────
    // - Division with zero:
    //      * Integer types -> runtime error / exception
    //      * Floating point -> returns +inf or -inf depending on sign
    // - Integer division truncates the fractional part.
    //      * Example: 7 / 2 = 3
    //      * To get decimal result, type-cast at least one operand to double: 7 / (double)2 = 3.5

    double part = 18;
    double total = 100;

    double percent = part / total * 100;
    cout << fixed << setprecision(2);
    cout << "The percent is: " << percent << "%" << endl;

    //     =============================================================───────────────
    // Floating Point Concepts
    //     =============================================================───────────────
    // Floating points store real numbers in scientific notation internally:
    // number = sign * mantissa * 2^exponent (binary)
    //
    // Mantissa: the significant digits
    // Exponent: how many places to move the decimal point (base 2 in memory)
    //
    // Example for decimal understanding: number = mantissa * 10^exponent
    // e.g., 1.2345e4 = 1.2345 * 10^4 = 12345
    //       1.2345E-2 = 1.2345 * 10^-2 = 0.012345

    double num1 = 1.2345e4; // 12345
    double num2 = 1.2345E-2; // 0.012345

    // Maximum precision of double
    // double stores roughly 15-16 significant decimal digits
    // digits10 gives the maximum number of decimal digits that can be represented without loss
    int max_digits = numeric_limits<double>::digits10;

    // Example of using mantissa and exponent programmatically
    double mantissa = 1.2345;
    int exponent = 3; // move decimal point 3 places to the right
    double reconstructed = mantissa * pow(10, exponent); // 1.2345 * 10^3 = 1234.5

    //     =============================================================───────────────
    // Comments explaining floating point behavior
    //     =============================================================───────────────
    /*
    Floating Point Notes:
    - Numbers are stored as: sign * mantissa * 2^exponent (binary internal format)
    - 'e' or 'E' notation in code is for convenience:
        1.2345e4 = 1.2345 * 10^4
        1.2345E-2 = 1.2345 * 10^-2
    - Mantissa contains significant digits
    - Exponent shifts the decimal point left (-) or right (+)
    - Maximum decimal precision for double: 15-16 digits
    */

    return 0;
}
