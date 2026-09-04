// Од тастатура се внесуваат два позитивни едноцифрени различни броеви x и y.
// Потоа се внесува даден природен број N (каде N < 100,000), и после него се внесуваат N други природни броеви.
// За секој од внесените броеви да се провери дали завршуваат на цифрите x и y.
// Доколку бројот завршува на цифрите xx или yy, се печати бројот и пораката "Same digits".
// Доколку бројот завршува на цифрите xy или yx, се печати бројот и пораката "Different digits".
// Доколку бројот не завршува на цифрите x и y, се печати само бројот.

#include <iostream>
using namespace std;

int main() {
    int x, y;
    cin >> x >> y;

    int n;
    cin >> n;

    for (int i = 0; i < n; i++) {
        int num;
        cin >> num;

        int two_digit = n % 100;
        int tens_digit = two_digit / 10;
        int ones_digit = two_digit % 10;

        if (tens_digit == x && ones_digit == x || tens_digit == y && ones_digit == y) {
            cout << "Same digits" << endl;
        } else if (tens_digit == x && ones_digit == y || tens_digit == y && ones_digit == x) {
            cout << "Different digits" << endl;
        } else if (ones_digit != x && ones_digit != y) {
            cout << n << endl;
        }
    }

    return 0;
}
