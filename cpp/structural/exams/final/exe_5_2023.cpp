/*
    ============================================================
    TASK 2 — Matrix Z Pattern (Cumulative Sums)
    ============================================================
    Се внесуваат димензиите на матрица A (m x n), m,n <= 100, како и нејзините елементи (цели броеви).

    Да се испечатат сите збирови кои се добиваат со испишување на шаблонот на буквата Z.

    Првиот шаблон се добива од подматрица 2x2 со почеток во (0,0), следниот од 3x3, па натаму сè до најголемата можна подматрица.

    Input:
      4
      5
      1  2  3  4  5
      6  7  8  9 10
      11 12 13 14 15
      16 17 18 19 20

    Output:
      16
      49
      100
*/
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int matrix[n][m];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    int maxSize = min(n, m);

    // Solution 1:
    for (int size = 2; size <= maxSize; size++) {
        int sum = 0;

        // Top row
        for (int j = 0; j < size; j++) {
            sum += matrix[0][j];
        }

        // Bottom row
        for (int j = 0; j < size; j++) {
            sum += matrix[size - 1][j];
        }

        // Middle diagonal (skip corners already counted)
        for (int i = 1; i < size - 1; i++) {
            sum += matrix[i][size - 1 - i];
        }

        cout << sum << endl;
    }

    // Solution 2:
    for (int k = 2; k <= maxSize; k++) {
        int sum = 0;

        for (int i = 0; i < k; i++) {
            for (int j = 0; j < k; j++) {
                // Top row, Bottom row, Middle diagonal
                if (i == 0 || i == k - 1 || i + j == k - 1) {
                    sum += matrix[i][j];
                }
            }
        }

        cout << sum << endl;
    }

    return 0;
}
