// 6. Write a program that asks how many miles you have driven and how many gallons of gasoline you have used
// and then reports the miles per gallon your car has gotten.

// Or, if you prefer, the program can request distance in kilometers and petrol in liters and then report the result
// European style, in liters per 100 kilometers.

#include <iostream>

using namespace std;

int main() {
    double kilometers;
    double liters;

    cout << "How many kilometers you have driven? ";
    cin >> kilometers;

    cout << "How many liters of petrol you have used? ";
    cin >> liters;

    // CAUTION: If kilometers and liters were int type
    // Integer Division may result in 0
    // Making one operand a double forces floating-point division and preserves the fractional result.
    double result = liters / kilometers * 100;
    cout << result << " liters per 100 kilometers." << endl;

    return 0;
}
