// Да се напише програма што од непознат број на цели броеви што се внесуваат од тастатура
// ќе ги определи двата броја со најголеми вредности.
// Програмата завршува ако се внесе невалидна репрезентација на број.

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

    cout << "First max: " << max_1 << endl;
    cout << "Second max: " << max_2 << endl;

    return 0;
}
