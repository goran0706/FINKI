// Да се напише програма што од непознат број на цели броеви што се внесуваат од тастатура
// ќе го определи бројот со максимална вредност.
// Програмата завршува ако се внесе невалидна репрезентација на број.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int max = n;

    while (cin >> n) {
        if (max < n) {
            max = n;
        }
    }

    cout << "Max = " << max << endl;

    return 0;
}
