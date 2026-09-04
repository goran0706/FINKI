// Да се напише програма која за даден природен број ја пресметува разликата
// помеѓу најблискиот поголем од него прост број и самиот тој број.
//
// Програмата треба да користи рекурзивна функција за наоѓање на соодветниот прост број,
// која пак треба да користи рекурзивна функција за проверка дали даден број е прост број

#include <iostream>
using namespace std;

bool is_prime_helper(int n, int d) {
    if (d * d > n) return true;
    if (n % d == 0) return false;
    return is_prime_helper(n, d + 1);
}

bool is_prime(int n) {
    if (n <= 1) return false;
    return is_prime_helper(n, 2);
}

int next_prime(int n) {
    if (is_prime(n)) return n;
    return next_prime(n + 1);
}

int main() {
    int n;
    cin >> n;

    int next = next_prime(n + 1);
    cout << next - n << endl;

    return 0;
}
