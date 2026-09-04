// Да се напишат следните функции за пребарување во низа:
// • Линеарно пребарување
// • Бинарно пребарување
// Потоа да се напише главна програма во која ќе се пополнува низа со броевите од 1 до 1 000 000,
// а потоа се генерира случаен број во овој опсег чија што позиција треба да се пронајде со повикување на двете функции за пребарување.

#include <iostream>
using namespace std;

int linear_search(const int *arr, const int size, const int value) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == value) {
            return i;
        }
    }

    return -1;
}

int binary_search(const int *arr, const int size, const int value) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == value) {
            return mid;
        }
        if (arr[mid] < value) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    cout << "Enter search value: " << endl;
    int search;
    cin >> search;

    cout << linear_search(a, n, search) << endl;
    cout << binary_search(a, n, search) << endl;
}
