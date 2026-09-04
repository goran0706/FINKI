// Да се напише програма која чита знак од тастатура и
// во зависнот од тоа дали е мала или голема буква печати 1 или 0, соодветно.
// ПОМОШ: Користете логички и релациски оператори за тестирање на ASCII вредноста на знакот.

#include <iostream>
using namespace std;

int main() {
    char c;
    cin >> c;

    if (c >= 'A' && c <= 'Z') {
        cout << 1 << endl;
    } else if (c >= 'a' && c <= 'z') {
        cout << 0 << endl;
    } else {
        cout << "Invalid character" << endl;
    }

    return 0;
}
