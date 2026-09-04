// Да се напише програма што ќе ги испечати сите броеви од зададен опсег
// кои се читаат исто и одлево надесно и оддесно налево.

#include <iostream>
using namespace std;

int reverse(int value);

int main() {
    int start, end;
    cin >> start >> end;

    for (int i = start; i < end; i++) {
        if (reverse(i) == i) {
            cout << i << " ";
        }
    }

    return 0;
}

int reverse(int value) {
    int reversed = 0;

    while (value > 0) {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    }

    return reversed;
}
