// Да се напише програма што ќе ги отпечати сите парови прости броеви помали од 1000 што се разликуваат меѓу себе за 2.
// На крај да се отпечати и нивниот број.

#include <iostream>
using namespace std;

bool is_prime(int n);

int main() {
    int count = 0;

    for (int i = 2; i < 1000; i++) {
        if (is_prime(i) && is_prime(i + 2)) {
            cout << i << " ";
            count++;
        }
    }

    cout << endl;
    cout << "Primes count: " << count << endl;

    return 0;
}


bool is_prime(const int n) {
    if (n <= 1) {
        return false;
    }

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return false;
        }
    }

    return true;
}
