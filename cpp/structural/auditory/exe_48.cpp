// Да се напише програма која ќе го пресмета скаларниот производ на два вектори со по n координати.
// Бројот на координати n, како и координатите на векторите се внесуваат од стандарден влез.
// Резултатот да се испечати на екран.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[n];
    int b[n];

    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];

    int scalar = 0;

    for (int i = 0; i < n; i++) {
        scalar += a[i] * b[i];
    }

    cout << "Scalar: " << scalar << endl;

    return 0;
}
