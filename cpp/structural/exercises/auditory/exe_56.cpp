// Да се напише програма која за квадратна матрица внесена од тастатура
// ќе испечати на екран дали таа е симетрична во однос на главната дијагонала.

// Да се напише програма која за квадратна матрица внесена од тастатура
// ќе испечати на екран дали таа е симетрична во однос на споредна дијагонала.

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

    bool symmetrical_main_diagonal = true;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[j][i]) {
                symmetrical_main_diagonal = false;
                break;
            }
        }
    }

    if (symmetrical_main_diagonal) {
        cout << "Symmetrical across the main diagonal" << endl;
    } else {
        cout << "Not symmetrical across the main diagonal" << endl;
    }


    bool symmetrical_secondary_diagonal = true;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[n - 1 - j][n - 1 - i]) {
                symmetrical_secondary_diagonal = false;
                break;
            }
        }
    }

    if (symmetrical_secondary_diagonal) {
        cout << "Symmetrical across the secondary diagonal" << endl;
    } else {
        cout << "Not symmetrical across the secondary diagonal" << endl;
    }

    return 0;
}
