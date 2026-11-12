#include <iostream>
using namespace std;

int main() {
    int MAX = 100;
    int matrix[MAX][MAX];
    int n, m;
    cin >> n >> m;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    // Печати по редици
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << matrix[i][j];
        }
    }

    // Печати по колони
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix[j][i];
        }
    }

    // Елементи на главна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                cout << matrix[j][i];
            }
        }
    }

    // Подобро решение:
    for (int i = 0; i < n; i++) {
        cout << matrix[i][i];
    }


    // Елементи над главна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i < j) {
                cout << matrix[j][i];
            }
        }
    }

    // Елементи под главна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i > j) {
                cout << matrix[j][i];
            }
        }
    }

    // Елементи на споредна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j == n - 1) {
                cout << matrix[j][i];
            }
        }
    }

    // Подобро решение:
    for (int i = 0; i < n; i++) {
        cout << matrix[i][n - 1 - i];
    }


    // Елементи над споредна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j < n - 1) {
                cout << matrix[j][i];
            }
        }
    }

    // Елементи под споредна дијагонала
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j > n - 1) {
                cout << matrix[j][i];
            }
        }
    }

    // Симетрична според главна дијагонала
    bool symmetricalMain = true;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[j][i]) {
                symmetricalMain = false;
                break;
            }
        }
        if (!symmetricalMain) break;
    }

    // Симетрична според споредна дијагонала
    bool symmetricalSecondary = true;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == matrix[n - 1 - j][n - 1 - i]) {
                symmetricalSecondary = false;
                break;
            }
        }
        if (!symmetricalSecondary) break;
    }

    // Ротирање 90 степени во десно
    // Почетна матрица (n = 3)
    //
    // 1 2 3
    // 4 5 6
    // 7 8 9
    //
    // Формула:
    // rotated[j][n - 1 - i] = matrix[i][j];
    //
    // Тоа значи:
    // редот станува колона,
    // колона станува n-1-ред  (ротација 90° десно)

    int rotated90Right[MAX][MAX];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // ===== i = 0 =====
            // j = 0 → matrix[0][0] = 1
            // rotated[0][2] = 1

            // j = 1 → matrix[0][1] = 2
            // rotated[1][2] = 2

            // j = 2 → matrix[0][2] = 3
            // rotated[2][2] = 3


            // ===== i = 1 =====
            // j = 0 → matrix[1][0] = 4
            // rotated[0][1] = 4

            // j = 1 → matrix[1][1] = 5
            // rotated[1][1] = 5

            // j = 2 → matrix[1][2] = 6
            // rotated[2][1] = 6


            // ===== i = 2 =====
            // j = 0 → matrix[2][0] = 7
            // rotated[0][0] = 7

            // j = 1 → matrix[2][1] = 8
            // rotated[1][0] = 8

            // j = 2 → matrix[2][2] = 9
            // rotated[2][0] = 9

            rotated90Right[j][n - 1 - i] = matrix[i][j];
        }
    }

    /*
    Краен резултат во rotated90Right:

    7 4 1
    8 5 2
    9 6 3
    */

    // Ротирање 90 степени во лево
    int rotated90Left[MAX][MAX];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            rotated90Left[n - 1 - j][i] = matrix[i][j];
        }
    }

    // Ротирање 180 степени
    int rotated180[MAX][MAX];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            rotated180[n - 1 - i][n - 1 - j] = matrix[i][j];
        }
    }
}
