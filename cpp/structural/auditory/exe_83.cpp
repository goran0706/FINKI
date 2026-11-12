// Да се пресмета збирот 1! + (1+2)! + (1+2+3)! + … + (1+2+…+n)! притоа:
// - користете рекурзивна функција за пресметување на збирот на првите k природни броеви.
// - користете рекурзивна функција за пресметување на факториел на еден природен број.

#include <iostream>
using namespace std;

int sum_k_numbers(int n);

int factorial(int n);

int main() {
    int n;
    cin >> n;
    int total = 0;

    for (int i = 1; i <= n; i++) {
        int sum = sum_k_numbers(i); // sum of first i natural numbers
        total += factorial(sum); // add factorial of that sum
    }

    cout << total << endl;

    return 0;
}

int sum_k_numbers(int n) {
    if (n == 0) return 0;
    return n + sum_k_numbers(n - 1);
}

int factorial(int n) {
    if (n < 0) return -1;
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}
