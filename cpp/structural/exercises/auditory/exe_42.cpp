// Да се напише програма која за даден природен број ја пресметува разликата
// помеѓу најблискиот поголем од него прост број и самиот тој број.
// 577 – 573 = 4

#include <iostream>
using namespace std;

bool is_prime(int n);

int main() {
    int n;
    cin >> n;

    int next = n + 1;

    while (!is_prime(next)) {
        next++;
    }

    cout << next << " - " << n << " = " << next - n << endl;

    return 0;
}

bool is_prime(const int n) {
    // 1, 0 and negative numbers are not prime numbers
    if (n <= 1) {
        return false;
    }

    // We try to find divisors:
    // - if we find any i that divides n → not prime
    // - If we finish the loop without finding one → prime

    // Optimisation:
    // - We optimize the loop by checking divisors up to √n (i * i <= n)
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            return false;
        }
    }

    return true;
}
