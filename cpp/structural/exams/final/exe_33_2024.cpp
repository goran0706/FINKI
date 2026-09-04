/*
    ============================================================
    TASK 18
    ============================================================
    Квадратна матрица:
    X = збир под главна дијагонала
    Y = збир под споредна дијагонала
    Се креира нова матрица B според правилата.
*/
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int matrix[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> matrix[i][j];
        }
    }

    int X = 0;
    int Y = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i > j) {
                X += matrix[i][j];
            }
            if (i + j > n - 1) {
                Y += matrix[i][j];
            }
        }
    }

    int matrix_b[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                matrix_b[i][j] = X;
            }
            if (i + j == n - 1 || i > n / 2 && j == n / 2) {
                matrix_b[i][j] = Y;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix_b[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
