// 1. Да се трансформира низа така што парните елементи ќе биде на почеток во низата (во обратен редослед),
// а непарните броеви на крај од низата (после парните, во точен редослед)

// Пример:
// n = 5
// 95 12 50 23 1
// Резултат:
// 50 12 95 23 1
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // 1. Read elements
    int a[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    // 2. Transform
    int transformed[n];
    int write = 0;

    // Solution 1:
    for (int i = n - 1; i >= 0; i--) {
        if (a[i] % 2 == 0) {
            transformed[write++] = a[i];
        }
    }

    for (int i = 0; i < n; i++) {
        if (a[i] % 2 != 0) {
            transformed[write++] = a[i];
        }
    }

    // Solution 2:
    int left = 0;
    int right = n - 1;

    for (int i = n - 1; i >= 0; i--) {
        if (a[i] % 2 == 0) {
            transformed[left++] = a[i];
        } else {
            transformed[right--] = a[i];
        }
    }

    // 3. Print transformed elements
    for (int i = 0; i < n; i++) {
        cout << transformed[i] << " ";
    }

    return 0;
}
