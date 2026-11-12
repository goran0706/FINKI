// Да се трансформира низа со користење на поинтери

#include <iostream>
using namespace std;

void transform(int *a, const int n, const int factor) {
    // Pre-calculate the last element's memory address
    // Don't use a < a + n directly in while loop since 'a' increments
    const int *end = a + n;

    // Check if we reached the last element's memory address
    while (a < end) {
        *a = *a * factor;
        a++;
    }
}

void print_elements(const int *a, const int n) {
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
}

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int factor;
    cin >> factor;

    transform(a, n, factor);
    print_elements(a, n);

    return 0;
}
