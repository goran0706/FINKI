/*
    === 6. ===
    Vnesuvas niza od n broevi.
    Da se ispecati sumata na site parni cifri od eden broj.
    Da se ispecati brojot so najgolemata suma.
    Zbirot na cifrite da bide vo posebna funkcija
*/
#include <iostream>
#include <cmath>
using namespace std;

int sum_even(int n) {
    int sum = 0;

    n = abs(n);

    while (n > 0) {
        int digit = n % 10;
        if (digit % 2 == 0) {
            sum += digit;
        }
        n /= 10;
    }

    return sum;
}

int main() {
    int n;
    cin >> n;

    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int max_number = a[0];
    int max_sum = sum_even(a[0]);

    for (int i = 0; i < n; i++) {
        int current_number = a[i];
        int current_sum = sum_even(current_number);

        cout << current_sum << endl;

        if (current_sum > max_sum) {
            max_sum = current_sum;
            max_number = a[i];
        }
    }

    cout << max_number << endl;

    return 0;
}
