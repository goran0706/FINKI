// Да се напише програма што ќе ги отпечати сите прости броеви
// помали од 10000 чиј што збир на цифри е исто така прост број.
// На крајот да се отпечати колку вакви броеви се пронајдени.

#include <iostream>
using namespace std;

bool is_prime(int n);

int sum_digits(int n);

int main() {
    int count = 0;

    for (int i = 2; i < 10000; i++) {
        if (is_prime(i) && is_prime(sum_digits(i))) {
            cout << i << " ";
            count++;
        }
    }

    cout << endl;
    cout << "Primes count: " << count << endl;

    return 0;
}

bool is_prime(int n) {
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

int sum_digits(int n) {
    int sum = 0;

    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }

    return sum;
}
