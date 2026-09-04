// Да се напише програма за пресметување на сумата на сите парни двоцифрени броеви.
// Добиената сума се печати на екран.

#include <iostream>
using namespace std;

int main() {
    int sumEven = 0;

    for (int i = 10; i < 100; i += 2) {
        sumEven += i;
    }

    cout << "Sum even: " << sumEven << endl;

    return 0;
}
