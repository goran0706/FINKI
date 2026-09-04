// Да се напише програма што од непознат број на цели броеви што се внесуваат од
// тастатура ќе ги определи двата броја со најголеми вредности.
// Програмата завршува ако се внесе невалидна репрезентација на број.
// Ако се внесат броевите 2 4 7 4 2 1 8 6 9 7 10 3 програмата ќе отпечати 10 и 9.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int max_1 = n;
    int max_2 = n;

    while (cin >> n) {
        if (max_1 < n) {
            max_2 = max_1;
            max_1 = n;
        } else if (max_2 < n) {
            max_2 = n;
        }
    }

    cout << "First largest number is " << max_1 << endl;
    cout << "Second largest number is " << max_2 << endl;

    return 0;
}
