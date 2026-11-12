// Да се напише програма за пресметување на сумата на сите непарни двоцифрени броеви.
// Програмата ја печати сумата на екран во следниот формат:

// 11 + 13 + 15 + 17 + … + 97 + 99 = 2475

#include <iostream>
using namespace std;

int main() {
    int sumOdd = 0;

    for (int i = 11; i < 100; i += 2) {
        sumOdd += i;
        cout << i << (i != 99 ? " + " : "");
    }

    cout << " = " << sumOdd << endl;

    return 0;
}
