// Да се пресмета сумата на непарни и парни позиции посебно.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int sum_odd = 0;
    int sum_even = 0;

    for (int i = 1; i <= n; i++) {
        int num;
        cin >> num;

        // inline instead of using array
        // 'i' represents position starting from 1 as first element
        if (i % 2 == 0) {
            sum_even += num;
        } else {
            sum_odd += num;
        }
    }

    cout << "Sum odd: " << sum_odd << endl;
    cout << "Sum even: " << sum_even << endl;

    return 0;
}
