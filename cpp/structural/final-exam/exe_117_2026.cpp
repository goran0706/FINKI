// Од тастатура се внесува низа со n елементи.
// Вредностите на елементите се во опсег од -5000 до 5000.
// Потребно е да се најде и испечати:
// - Првата вредност што е помала од максималната (втората најголема вредност во низата).
// - Аритметичката средина (просекот) на целата низа.
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n < 2) {
        cout << "Invalid size" << endl;
        return 0;
    }

    int a[100];
    double sum = 0;

    for (int i = 0; i < n; i++) {
        cin >> a[i];
        if (a[i] < -5000 || a[i] > 5000) {
            cout << "Invalid value" << endl;
            return 0;
        }
        sum += a[i];
    }

    int max_1 = a[0];
    int max_2 = -5001;

    for (int i = 1; i < n; i++) {
        if (a[i] > max_1) {
            max_2 = max_1;
            max_1 = a[i];
        } else if (a[i] < max_1 && a[i] > max_2) {
            max_2 = a[i];
        }
    }

    if (max_2 == -5001) {
        cout << "Nema pomala vrednost" << endl;
    } else {
        cout << max_2 << endl;
    }

    cout << (sum / n) << endl;

    return 0;
}
