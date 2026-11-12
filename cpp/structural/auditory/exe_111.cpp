// Благ број е број што е составен само од парни цифри (0, 2, 4, 6, 8).
// Во зададен опсег (почетокот m и крајот на опегот n се цели броеви чија вредност се внесува од тастатура), да се најде и испечати најмалиот „благ број“.
// Ако не постои таков број, да се испечати NE.

#include <iostream>
#include <climits>
using namespace std;

bool is_sweet_number(int n) {
    while (n > 0) {
        int current = n % 10;
        if (current % 2 != 0) {
            return false;
        }
        n /= 10;
    }

    return true;
}

int main() {
    int m, n;
    cin >> m >> n;

    int min = INT_MAX;

    for (int i = m; i <= n; i++) {
        if (is_sweet_number(i) && i < min) {
            min = i;
        }
    }

    // Allows printing 0 since 0 is a falsy value
    if (min != INT_MAX) {
        cout << min << endl;
    } else {
        cout << "Ne" << endl;
    }
}
