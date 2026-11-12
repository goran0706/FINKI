// Да се напише рекурзивна функција count_down(int n) која за даден цел број n ќе овозможи печатење на броевите од n до 0.

#include <iostream>
using namespace std;

void count_down(int n);

int main() {
    int n;
    cin >> n;

    count_down(n);
}

void count_down(const int n) {
    // Base case
    if (n < 0) return;

    // Print the actual number
    cout << n << endl;

    // Recursive case: calls self and decrement the number
    count_down(n - 1);
}
