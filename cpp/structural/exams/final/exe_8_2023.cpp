/*
    ============================================================
    TASK 5 — Matrix N Pattern (Cumulative Sums)
    ============================================================
    Исто како TASK 2, но шаблонот е буквата N.

    Подматрици: 2x2, 3x3, ...

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

    int matrix[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    const int maxSize = min(n, m);

    // Solution 1:
    for (int size = 2; size <= maxSize; size++) {
        int sum = 0;

        // Left col
        for (int i = 0; i < size; i++) {
            sum += matrix[i][0];
        }
        // Right col
        for (int i = 0; i < size; i++) {
            sum += matrix[i][size - 1];
        }
        // Main diagonal
        for (int i = 1; i < size - 1; i++) {
            sum += matrix[i][i];
        }

        cout << sum << endl;
    }

    // Solution 2:
    for (int k = 2; k <= maxSize; k++) {
        int sum = 0;

        for (int i = 0; i < k; i++) {
            for (int j = 0; j < k; j++) {
                // Left col, Right col, Main diagonal
                if (j == 0 || j == k - 1 || i == j) {
                    sum += matrix[i][j];
                }
            }
        }

        cout << sum << endl;
    }

    return 0;
}
