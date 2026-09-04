// Од тастатура се внесуваат должини на три отсечки во произволен редослед.
// Да се провери дали од дадените отсечки може да се конструра триаголник.
// Ако може, да се испечати дали триаголникот е разностран, рамностран или рамнокрак и да му се пресмета плоштината.

#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    // Triangle Inequality Theorem:
    // sum of any two sides must be greater than the third
    if (a + b <= c || a + c <= b || b + c <= a) {
        cout << "Cannot construct a triangle" << endl;
        return 0;
    }

    if (a == b && b == c) {
        // All sides equal
        cout << "Рамностран триаголник" << endl;
    } else if (a != b && a != c && b != c) {
        // All sides different
        cout << "Разностран триаголник" << endl;
    } else {
        // Exactly two sides equal
        cout << "Рамнокрак триаголник" << endl;
    }

    return 0;
}
