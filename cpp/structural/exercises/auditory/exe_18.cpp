// Да се напише програма за пресметување на \$y = x^n\\$ за даден природен број n, n >= 1 и реален број x.

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n;
    double x;

    cout << "Enter a natural number: ";
    cin >> n;

    cout << "Enter a real number: ";
    cin >> x;

    if (n < 1) {
        cout << "n must be greater than 0";
        return 1;
    }

    const double y = pow(x, n);
    cout << "x^n = " << y << endl;

    return 0;
}
