/*
    За даден број n, испечатете ја следнава секвенца без да користите наредби
    за повторување (со помош на рекурзија): n n-3 n-6 n-9 … n-9 n-6 n-3 n

    Напомена: При печатење на секвенцата на броеви се користат празни места измеѓу броевите.

    Input: 16
    Output: 16 13 10 7 4 1 -2 1 4 7 10 13 16
*/

#include <iostream>
using namespace std;

void process_number(int n, int k) {
    if (n < 0) {
        cout << n << " ";
        return;
    }

    cout << n << " ";
    process_number(n - k, k);
    cout << n << " ";
}

int main() {
    int n;
    cin >> n;
    process_number(n, 3);
}
