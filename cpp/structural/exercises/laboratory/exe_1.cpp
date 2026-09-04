// TASK 1:
// Да се напише програма која ќе ги изведува основните математички операции (+, -, *, /, %)
// врз два броја кои се читаат од стандарден влез.

#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    cout << "a + b = " << a + b << endl;
    cout << "a - b = " << a - b << endl;
    cout << "a * b = " << a * b << endl;
    cout << "a / b = " << (b == 0 ? 0 : a / b) << endl;
}
