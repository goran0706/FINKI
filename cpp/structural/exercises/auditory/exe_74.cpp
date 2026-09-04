// Да се напише програма која што ќе ги избрише дупликатите од една низа.
// На крај, да се испечати на екран новодобиената низа.
// Елементите од низата се читаат од стандарден влез.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int write = 0;

    for (int read = 0; read < n; read++) {
        bool seen = false;

        for (int i = 0; i < write; i++) {
            if (a[read] == a[i]) {
                seen = true;
                break;
            }
        }

        if (!seen) {
            a[write] = a[read];
            write++;
        }
    }

    for (int i = 0; i < write; i++) {
        cout << a[i] << " ";
    }

    return 0;
}
