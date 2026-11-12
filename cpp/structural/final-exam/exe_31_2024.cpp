/*
    ============================================================
    TASK 16
    ============================================================
    Рекурзивна функција за наоѓање максимална цифра од даден цел број.
*/
#include <iostream>
using namespace std;

// Solution 1
int find_max(int n) {
    if (n == 0) {
        return 0;
    }

    int max_digit = n % 10;
    int max_rest_digit = find_max(n / 10);

    return max_digit > max_rest_digit ? max_digit : max_rest_digit;
}

// Solution 2
int find_max(int n, int max) {
    if (n == 0) {
        return max;
    }

    if (n % 10 > max) {
        max = n % 10;
    }

    return find_max(n / 10, max);
}

int main() {
    int n;

    while (cin >> n) {
        cout << (n == 0 ? 0 : find_max(n)) << endl;
        cout << (n == 0 ? 0 : find_max(n, 0)) << endl;
    }

    return 0;
}
