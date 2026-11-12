// 7. Write a program that asks you to enter an automobile gasoline consumption figure in the European style
// (liters per 100 kilometers) and converts to the U.S. style of miles per gallon. Note that in addition to using
// different units of measurement, the U.S. approach (distance / fuel) is the inverse of the European approach
// (fuel / distance). Note that 100 kilometers is 62.14 miles, and 1 gallon is 3.875 liters.
// Thus, 19 mpg is about 12.4 l/100 km, and 27 mpg is about 8.7 l/100 km.

#include <iostream>
using namespace std;

int main() {
    double l_per_100km;

    cout << "Enter fuel consumption in liters per 100km: ";
    cin >> l_per_100km;

    const double m_per_100km = 62.14;
    const double liters_per_gallon = 3.875;

    double mpg = (m_per_100km * liters_per_gallon) / l_per_100km;

    cout << l_per_100km << " l/100km = " << mpg << " mpg\n";

    return 0;
}
