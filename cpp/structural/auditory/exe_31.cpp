// Да се напише програма што на екран ќе ги испечати сите броеви од 1000 до N
// кај кои збирот на трите најмалку значајни цифри е еднаков со најзначајната цифра.
//
// 4031 (4=0+3+1), 5131 (5=1+3+1)

#include <iostream>
using namespace std;

int first_digit(int value);

int sum_last_digits(int value, int digit_count);

int main() {
    int n;
    cin >> n;

    for (int i = 1000; i < n; i++) {
        const int first = first_digit(i);
        const int sum = sum_last_digits(i, 3);

        if (first == sum) {
            cout << i << " ";
        }
    }

    return 0;
}

int first_digit(int value) {
    while (value >= 10) {
        value /= 10;
    }

    return value;
}

int sum_last_digits(int value, const int digit_count) {
    int sum = 0;

    for (int i = 0; i < digit_count; i++) {
        sum += value % 10;
        value /= 10;
    }

    return sum;
}
