// Да се напише програма која ќе провери дали дадена низа од n елементи која се чита од стандарден влез
// е строго растечка, строго опаѓачка или ниту строго растечка ниту строго опаѓачка.
// Резултатот да се испечати на екран.

#include <iostream>
using namespace std;

bool array_order(const int a[], const int n);

int main() {
    int n;
    cin >> n;

    int a[n];
    for (int i = 0; i < n; i++) cin >> a[i];

    bool order_asc = true;
    bool order_dsc = true;

    for (int i = 0; i < n - 1; i++) {
        if (a[i] > a[i + 1]) {
            order_asc = false;
        } else if (a[i] < a[i + 1]) {
            order_dsc = false;
        } else {
            order_asc = false;
            order_dsc = false;
        }
    }

    if (order_asc) {
        cout << "строго растечка" << endl;
    } else if (order_dsc) {
        cout << "строго опаѓачка" << endl;
    } else {
        cout << "ниту строго растечка ниту строго опаѓачка" << endl;
    }

    return 0;
}

bool array_order(const int a[], const int n) {
    bool order_asc = true;
    bool order_dsc = true;

    for (int i = 0; i < n - 1; i++) {
        if (a[i] > a[i + 1]) {
            order_asc = false;
        } else if (a[i] < a[i + 1]) {
            order_dsc = false;
        } else {
            order_asc = false;
            order_dsc = false;
        }
    }

    return order_asc && order_dsc;
}
