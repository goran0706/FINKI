// Да се напише програма која ќе провери дали дадена низа од n елементи која се чита од стандарден влез
// е строго растечка, строго опаѓачка или ниту строго растечка ниту строго опаѓачка.
// Резултатот да се испечати на екран.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    bool asc = true;
    bool dsc = true;

    for (int i = 0; i < n - 1; i++) {
        if (a[i] > a[i + 1]) {
            asc = false;
        } else if (a[i] < a[i + 1]) {
            dsc = false;
        } else {
            asc = false;
            dsc = false;
        }
    }

    if (asc) {
        cout << "Ascending array" << endl;
    } else if (dsc) {
        cout << "Descending array" << endl;
    } else {
        cout << "Neither" << endl;
    }

    return 0;
}
