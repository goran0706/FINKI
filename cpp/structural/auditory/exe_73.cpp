// Да се напише програма за ротирање на елементите на една низа за m местa во десно.
// На крај, да се испечати на екран ротираната низа.
// Елементите од низата и бројот на ротирања се читаат од стандарден влез.

#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    for (int k = 0; k < m; k++) {
        const int last = a[n - 1];
        for (int i = n - 1; i > 0; i--) {
            a[i] = a[i - 1];
        }
        a[0] = last;
    }

    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }

    return 0;
}
