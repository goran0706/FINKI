// Да се напише програма која што ќе ги избрише дупликатите од една низа.
// На крај, да се испечати на екран новодобиената низа.
// Елементите од низата се читаат од стандарден влез.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) cin >> a[i];

    // 1. Works only with sorted arrays
    // int write = 0;
    // for (int i = 0; i < n - 1; i++) {
    //     if (a[i] != a[i + 1]) {
    //         a[write++] = a[i];
    //     }
    // }
    //
    // int newSize = (n == 0) ? 0 : write + 1;
    // for (int i = 0; i < newSize; i++) cout << a[i];

    // 2. Works with sorted and unsorted arrays
    int write = 0;

    for (int read = 0; read < n; read++) {
        bool alreadyExists = false;

        // 'write' is the size of the unique set
        // 'j' scans only that unique set - not the entire array
        for (int j = 0; j < write; j++) {
            if (a[read] == a[j]) {
                alreadyExists = true;
                break;
            }
        }

        if (!alreadyExists) {
            a[write] = a[read];
            write++;
        }
    }

    for (int i = 0; i < write; i++) cout << a[i];

    return 0;
}
