// Да се имплементира linearSearch
// Да се имплементира binarySearch

#include <iostream>
using namespace std;

int linear_search(int a[], int n, int value) {
    for (int i = 0; i < n; i++) {
        if (a[i] == value) {
            return i;
        }
    }

    return -1;
}

int binary_search(int a[], int n, int value) {
    int left = 0;
    int right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (a[mid] == value) {
            return mid;
        }
        if (a[left] < value) {
            left = left + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    cout << "Enter search values: ";
    int key;
    cin >> key;

    cout << linear_search(a, n, key) << endl;
    cout << binary_search(a, n, key) << endl;
}
