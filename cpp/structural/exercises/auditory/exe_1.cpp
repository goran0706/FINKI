// Да се напише програма која ќе ја пресметува вредноста на математичкиот израз: x = 3/2 + (5 - 46*5/12)

#include <iostream>
using namespace std;

int main() {
    // Integer Division:
    // 1. Precision Loss
    // 2. Use modulus % to extract the reminder or
    // 3. Use a floating-point type for the result

    constexpr int xInteger = 3 / 2 + (5 - 46 * 5 / 12);
    cout << "x = " << xInteger << endl;

    constexpr float xFloat = 3.0 / 2 + (5 - 46.0 * 5 / 12);
    cout << "x = " << xFloat << endl;

    return 0;
}
