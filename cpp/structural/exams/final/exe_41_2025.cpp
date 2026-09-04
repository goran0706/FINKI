/*
    === 7. ===
    kvadratna matrica so samo 1 i 0, da ja najdes sumata na site elementi nad glavnata dijagonala i
    potoa da gi zamenis elementite na glavnata dijagonala so taa suma
*/
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[100][100];
    int sum = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
            if (i < j) {
                sum += a[i][j];
            }
        }
    }

    for (int i = 0; i < n; i++) {
        a[i][i] = sum;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << a[i][j] << " ";
        }
        cout << endl;
    }
}
