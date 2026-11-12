// Да се пресмета сума на парни и непарни броеви до N

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int sumEven = 0;
    int sumOdd = 0;

    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            sumEven += i;
        } else {
            sumOdd += i;
        }
    }

    cout << "Sum even: " << sumEven << endl;
    cout << "Sum odd: " << sumOdd << endl;

    return 0;
}
