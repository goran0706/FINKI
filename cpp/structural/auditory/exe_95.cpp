// Да се најде мин и макс со користење на покажувачи

#include <iostream>
using namespace std;

int find_min(const int *arr, const int n) {
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

int find_max(const int *arr, int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int find_min_ptr_arithmetic(const int *arr, const int n) {
    const int *end = arr + n;
    int min = *arr;
    while (arr < end) {
        if (*arr < min) {
            min = *arr;
        }

        arr++;
    }
    return min;
}

int find_max_ptr_arithmetic(const int *arr, const int n) {
    const int *end = arr + n;
    int max = *arr;
    while (arr < end) {
        if (*arr > max) {
            max = *arr;
        }
        arr++;
    }
    return max;
}

void find_min_ptr(const int el, int *min) {
    if (el < *min) {
        *min = el;
    }
}

void find_max_ptr(const int el, int *max) {
    if (el > *max) {
        *max = el;
    }
}

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int min = a[0];
    int max = a[0];
    cout << min << ":" << max << endl;

    min = find_min(a, n);
    max = find_max(a, n);
    cout << min << ":" << max << endl;

    min = find_min_ptr_arithmetic(a, n);
    max = find_max_ptr_arithmetic(a, n);
    cout << min << ":" << max << endl;

    for (int i = 0; i < n; i++) {
        find_min_ptr(a[i], &min);
        find_max_ptr(a[i], &max);
    }
    cout << min << ":" << max << endl;
}
