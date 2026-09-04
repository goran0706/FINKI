// Да се напише програма која за дадени страни на еден разностран триаголник
// ќе ги отпечати на екран периметарот и квадратот од плоштината (нека се работи со a = 5, b = 7.5, c = 10.2).
//
// Периметар (L) на триаголник:
// L = a + b + c
//
// Полупериметар:
// s = (a + b + c) / 2
//
// Плоштина (P) на триаголник:
// P = √( s * (s − a) * (s − b) * (s − c))

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    constexpr double a = 5, b = 7.5, c = 10.2;

    constexpr double L = a + b + c;
    constexpr double s = (a + b + c) / 2;
    const double P = sqrt(s * (s - a) * (s - b) * (s - c));

    cout << "L = " << L << endl;
    cout << "P = " << P << endl;

    return 0;
}
