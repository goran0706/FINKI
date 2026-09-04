// Да се напише рекурзивна функција count_up(int n) која за даден цел број n ќе овозможи печатење на броевите од 0 до n.
// (Искористете го кодот на функцијата count_down(int n) и решете ја задачата со промена на редоследот на командите).

#include <iostream>
using namespace std;

void count_up(int n);

int main() {
    int n;
    cin >> n;

    count_up(n);
}

void count_up(const int n) {
    // Base case
    if (n < 0) return;

    // Recursive case:
    // calls the functions piling up in call-stack
    // and unwinding the number in opposite order
    count_up(n - 1);
    cout << n << endl;
}
