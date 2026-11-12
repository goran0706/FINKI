// Да се пресмета збирот:
//
// 1! + (1 + 2)! + (1 + 2 + 3)! + … + (1 + 2 + … + n)!
//
// НАПОМЕНА:
// Користете функција за пресметување на збирот на првите k природни броеви
// Користете функција за пресметување факториел на еден природен број k.

#include <iostream>
using namespace std;

int sum_k_numbers(int n);

int factorial(int n);

int main() {
    int n;
    cin >> n;

    int total = 0;

    for (int i = 1; i <= n; i++) {
        const int sum = sum_k_numbers(i);
        total += factorial(sum);
    }

    cout << total << endl;

    return 0;
}

int sum_k_numbers(const int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

int factorial(const int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}
