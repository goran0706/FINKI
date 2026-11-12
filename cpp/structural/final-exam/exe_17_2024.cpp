/*
    ============================================================
    TASK 2
    ============================================================
    На стандарден влез се дадени повеќе редови со броеви така што секој ред започнува со еден цел број (N >= 1)
    што означува колку броеви следуваат по него во истиот ред.

    Да се испечати бројот со најголема најзначајна цифра.
    Читањето завршува кога ќе се прочита бројот 0.

    (Input / Output како во оригиналниот текст)
*/
#include <iostream>
#include <climits>
using namespace std;

int most_significant_digit(int n) {
    int digit = 0;

    while (n > 0) {
        digit = n % 10;
        n /= 10;
    }

    return digit;
}

int main() {
    int highest_number = INT_MIN;
    int highest_digit = INT_MIN;

    int n;

    while (cin >> n && n != 0) {
        for (int i = 0; i < n; i++) {
            int num;
            cin >> num;

            int digit = most_significant_digit(num);

            if (highest_digit < digit) {
                highest_digit = digit;
                highest_number = num;
            }
        }
    }

    cout << highest_digit << endl;
    cout << highest_number << endl;

    return 0;
}
