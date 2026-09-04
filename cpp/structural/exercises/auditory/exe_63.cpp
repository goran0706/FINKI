// Да се напише програма во програмскиот јазик C++ во која од тастатура се внесува позитивен цел број N.
// Програмата треба да испечати таблица за множење (од 1 до 10) за најзначајната цифра на бројот N,
// но ако најзначајната цифра е парен број тогаш се печати таблицата за множење за најмалку значајната цифра.
// Форматот во кој треба да се испечатат таблиците може да се види во дадениот пример.
//
// Пример:
// N: 7562
//
// 7 * 1 = 7
// 7 * 2 = 14
// 7 * 3 = 21
// 7 * 4 = 28
// 7 * 5 = 35
// 7 * 6 = 42
// 7 * 7 = 49
// 7 * 8 = 56
// 7 * 9 = 63
// 7 * 10 = 70

#include <iostream>
using namespace std;

int most_significant_digit(int n);

int least_significant_digit(int n);

void print_multiplication(int n);

int main() {
    int n;
    cin >> n;

    int most_significant = most_significant_digit(n);
    int least_significant = least_significant_digit(n);

    if (most_significant % 2 != 0) {
        print_multiplication(most_significant);
    } else {
        print_multiplication(least_significant);
    }
}

int most_significant_digit(int n) {
    while (n >= 10) {
        n /= 10;
    }
    return n;
}

int least_significant_digit(const int n) {
    return n % 10;
}

void print_multiplication(const int n) {
    for (int i = 1; i <= 10; i++) {
        cout << n << " * " << i << " = " << n * i << endl;
    }
}
