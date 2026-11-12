// Да се напише програма за ротирање на елементите на една низа за m места во лево.
// На крај, да се испечати на екран ротираната низа.
// Елементите од низата и бројот на ротирања се читаат од стандарден влез.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) cin >> a[i];

    int m;
    cin >> m;

    for (int i = 0; i < m; i++) {
        int first = a[0];
        for (int j = 0; j < n; j++) {
            a[j] = a[j + 1];
        }
        a[n - 1] = first;
    }

    for (int i = 0; i < n; i++) cout << a[i];

    return 0;
}
