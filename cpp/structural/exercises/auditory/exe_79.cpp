// Да се напише програма која за квадратна матрица внесена од тастатура
// ќе испечати на екран дали таа е симетрична во однос на главната дијагонала.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int matrix[n][n];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> matrix[i][j];
        }
    }

    bool symmetrical = true;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[j][i]) {
                symmetrical = false;
                break;
            }
        }
    }

    if (symmetrical) {
        cout << "Symmetrical" << endl;
    } else {
        cout << "Non-Symmetrical" << endl;
    }

    return 0;
}
