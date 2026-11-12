// Да се напише програма која за дадена низа од цели броеви (која што се внесува од тастатура) ќе го отпечати збирот на елементи од низата.
// Програмата треба да содржи рекурзивна функција за наоѓање на збирот на елементите во дадена низа.

#include <iostream>
using namespace std;

int sum_elements(const int *a, int n) {
    if (n == 0) return 0;
    return a[n - 1] + sum_elements(a, n - 1);
}

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int sum = sum_elements(a, n);
    cout << sum << endl;
}
