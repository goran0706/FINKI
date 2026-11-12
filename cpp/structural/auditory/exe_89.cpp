// За даден број n, да се напише рекурзивна функција која ќе ги изброи појавувањата на цифрата 8.
// Притоа, доколку до некоја цифра 8 има уште една цифра 8 веднаш лево од неа, нејзиното појавување се брои двојно.

#include <iostream>
using namespace std;


int count_digit(const int n, const int x) {
    if (n <= 0) return 0;
    const int count = n % 10 == x ? n / 10 % 10 == x ? 2 : 1 : 0;
    return count + count_digit(n / 10, x);
}

int main() {
    int n;
    cin >> n;
    cout << count_digit(n, 8) << endl;
}
