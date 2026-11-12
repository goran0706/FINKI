// 2. Redo Listing 5.4 using a type array object instead of a built-in array and type long double instead of long long.
// Find the value of 100!

#include <array>
#include <iostream>
using namespace std;

const int ArSize = 101;

int main() {
    // long long factorials[ArSize];
    array<long double, ArSize> factorials{};

    // factorials[1] = factorials[0] = 1LL;
    factorials[0] = factorials[1] = 1.0L;

    for (int i = 2; i < ArSize; i++)
        factorials[i] = i * factorials[i - 1];

    for (int i = 0; i < ArSize; i++)
        cout << i << "! = " << factorials[i] << endl;

    return 0;
}
