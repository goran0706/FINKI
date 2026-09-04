/*
    ============================================================
    TASK 8 — Matrix Z Contour Sum
    ============================================================
    Се внесува матрица A (m x n) и големина на буквата Z.

    Се креира нова матрица M каде секој елемент M[i][j] е збир
    на елементите кои ја формираат Z-патеката со почеток во A[i][j].

    Ако Z не може да се формира → елементот останува ист.

    Новата матрица M се печати.
*/
#include <iostream>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;

    int z_size;
    cin >> z_size;

    int A[100][100];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
        }
    }

    int M[100][100];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Check if a Z-shape of size 'z_size' can physically fit starting at A[i][j]
            // A valid Z-shape requires a bounding box of at least 2x2.
            if (z_size >= 2 && i + z_size <= m && j + z_size <= n) {
                int sum = 0;

                // 1. Top bar of the Z
                for (int k = 0; k < z_size; k++) {
                    sum += A[i][j + k];
                    // sum += A[0][j];
                }

                // 2. Diagonal of the Z (excluding the two sharp corners to prevent double counting)
                for (int k = 1; k < z_size - 1; k++) {
                    sum += A[i + k][j + z_size - 1 - k];
                    // sum += A[i][z_size - 1 - j];
                }

                // 3. Bottom bar of the Z
                for (int k = 0; k < z_size; k++) {
                    sum += A[i + z_size - 1][j + k];
                    // sum += A[z_size - 1][j];
                }

                M[i][j] = sum;
            } else {
                // If Z cannot be formed (too small or out of bounds) -> element stays the same
                M[i][j] = A[i][j];
            }
        }
    }

    // Print the resulting matrix M
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << M[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
