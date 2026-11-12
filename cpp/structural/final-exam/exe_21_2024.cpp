/*
    ============================================================
    TASK 6
    ============================================================
    Се вчитува матрица MxN (<=100x100) со 0 и 1.
    Да се избројат редици и колони со најмалку 3 последователни единици.
*/
#include <iostream>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;

    int matrix[100][100];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> matrix[i][j];
        }
    }

    int rows_count = 0;
    int cols_count = 0;

    // Approach 1: BAD - not flexible
    // Row Checking (Horizontal)
    for (int i = 0; i < m; i++) {
        for (int j = 1; j < n - 1; j++) {
            if (matrix[i][j - 1] == 1 && matrix[i][j] == 1 && matrix[i][j + 1] == 1) {
                rows_count++;
                break;
            }
        }
    }

    // Column Checking (Vertical)
    for (int j = 0; j < n; j++) {
        for (int i = 1; i < m - 1; i++) {
            if (matrix[i - 1][j] == 1 && matrix[i][j] == 1 && matrix[i + 1][j] == 1) {
                cols_count++;
                break;
            }
        }
    }

    // Approach 2: GOOD
    for (int i = 0; i < m; i++) {
        int ones_counter = 0;
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == 1) {
                ones_counter++;
                if (ones_counter >= 3) {
                    rows_count++;
                    break;
                }
            } else {
                ones_counter = 0;
            }
        }
    }

    for (int j = 0; j < n; j++) {
        int ones_counter = 0;
        for (int i = 0; i < m; i++) {
            if (matrix[i][j] == 1) {
                ones_counter++;
                if (ones_counter >= 3) {
                    cols_count++;
                    break;
                }
            } else {
                ones_counter = 0;
            }
        }
    }

    cout << "rows_count: " << rows_count << endl;
    cout << "cols_count: " << cols_count << endl;

    return 0;
}
