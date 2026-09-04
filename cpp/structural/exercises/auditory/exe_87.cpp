// Да се напише програма што ќе ја испишува вредноста на n-тиот член на низата дефинирана со:
// x[n] = (n - 1) * x[n - 1] / n + x[n - 2] / n

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int x[n];
    x[n] = (n - 1) * x[n - 1] / n + x[n - 2] / n;

    cout << x[n] << endl;

    return 0;
}
