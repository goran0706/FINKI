// Да се напише програма со која ќе се отпечати максимумот од два броја чии вредности се читаат од тастатура.

#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    int max = a;
    if (max < b) {
        max = b;
    }

    cout << "Max: " << max << endl;

    return 0;
}
