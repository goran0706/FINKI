// Пример за рекурзивна функција:
// - factorial

#include <iostream>
using namespace std;

int factorial(int n);

int main() {
    int n;
    cin >> n;

    cout << factorial(n) << endl;
    return 0;
}

int factorial(const int n) {
    if (n < 0) {
        return -1;
    }

    if (n == 0 || n == 1) {
        return 1;
    }

    return n * factorial(n - 1);
}
