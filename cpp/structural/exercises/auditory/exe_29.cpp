// Да се напише програма што од n броеви (внесени од тастатура)
// ќе го определи бројот на броеви што се деливи со 3, при делењето со 3 имаат остаток 1, односно 2.
// Задачата да се реши со while, do…while и for

#include <iostream>
using namespace std;

int main() {
    int n;
    int count_0 = 0;
    int count_1 = 0;
    int count_2 = 0;

    // ---------------------
    // 1. Using while loop
    // ---------------------
    while (cin >> n && n != -1) {
        if (n % 3 == 0) {
            count_0++;
        }
        if (n % 3 == 1) {
            count_1++;
        }
        if (n % 3 == 2) {
            count_2++;
        }
        cout << "Divisible by 3 counter: " << count_0 << endl;
        cout << "Reminder 1 counter: " << count_1 << endl;
        cout << "Reminder 2 counter: " << count_2 << endl;
    }

    // ------------------------
    // 2. Using do-while loop
    // ------------------------
    do {
        if (n % 3 == 0) {
            count_0++;
        }
        if (n % 3 == 1) {
            count_1++;
        }
        if (n % 3 == 2) {
            count_2++;
        }
        cout << "Divisible by 3 counter: " << count_0 << endl;
        cout << "Reminder 1 counter: " << count_1 << endl;
        cout << "Reminder 2 counter: " << count_2 << endl;
    } while (cin >> n && n != -1);

    // ------------------------
    // 3. Using for loop
    // ------------------------
    for (; cin >> n && n != -1;) {
        if (n % 3 == 0) {
            count_0++;
        }
        if (n % 3 == 1) {
            count_1++;
        }
        if (n % 3 == 2) {
            count_2++;
        }
        cout << "Divisible by 3 counter: " << count_0 << endl;
        cout << "Reminder 1 counter: " << count_1 << endl;
        cout << "Reminder 2 counter: " << count_2 << endl;
    }

    return 0;
}
