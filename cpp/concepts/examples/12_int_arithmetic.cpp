#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 5;
    constexpr int ZERO = 0;

    cout << "a + b = " << a + b << endl;
    cout << "a - b = " << a - b << endl;
    cout << "a * b = " << a * b << endl;

    // Always check and gracefully handle divisions by zero. For both / and % operators
    cout << "a / b = " << a / b << endl;
    cout << "a % b = " << a % b << endl;
    // cout << "a / b = " << a / ZERO << endl; // Division by zero is undefined may crash
    // cout << "a % b = " << a % ZERO << endl; // Division by zero is undefined may crash

    // Remember:
    // - Division with zero throws an exception for integer types
    // - Division with zero returns infinity for floating points
    // - Division of two integers may result in truncated whole number, discarding any fractional or decimal part.
    //   Unlike standard division, which may yield a decimal, integer division returns only the integer quotient.
    //   Defining or type-casting one of the operands will force the calculation to be a floating point.

    int part = 18;
    int total = 100;

    double percent = part / total * 100;
    cout << "The percent is truncated to whole number: " << percent << endl;

    percent = static_cast<double>(part) / total * 100;
    cout << "The percent is truncated to whole number: " << percent << endl;
}
