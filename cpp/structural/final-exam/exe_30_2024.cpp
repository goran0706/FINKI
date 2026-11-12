/*
    ============================================================
    TASK 15
    ============================================================
    Порамнување: цифрата 9 се заменува со 7.
    Да се испечатат најмалите 5 порамнувања.
    ЗАБРАНЕТО користење глобални променливи.
*/
#include <iostream>
using namespace std;

int transformInPlace(int n) {
    int result = 0;
    int multiplier = 1;

    while (n > 0) {
        int digit = n % 10;
        if (digit == 9) {
            digit = 7;
        }
        result += digit * multiplier;
        multiplier *= 10;
        n /= 10;
    }
    return result;
}

void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    int n;
    cin >> n;

    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    bubble_sort(a, n);

    for (int i = 0; i < n; i++) {
        cout << transformInPlace(a[i]) << endl;
    }
}
