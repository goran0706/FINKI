// Да се напише програма во која со посебна функција се пресметува куб n3 за вчитан природен број n.
// kub(n)

#include <iostream>
#include <cmath>
using namespace std;

double kub(double n);

int main() {
    double n;
    cin >> n;
    cout << "n^3 = " << kub(n) << endl;

    return 0;
}

double kub(const double n) {
    // return n * n * n;
    return pow(n, 3);
}
