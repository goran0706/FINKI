/*
    ============================================================
    TASK 17
    ============================================================
    Средниот елемент во секоја редица се заменува со апсолутна разлика на сумите од двете половини.
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

    // Solution:
    for (int i = 0; i < n; i++) {
        int sum_first_half = 0;
        int sum_second_half = 0;

        for (int j = 0; j < n / 2; j++) {
            sum_first_half += matrix[i][j];
        }

        for (int j = n / 2; j < n; j++) {
            sum_second_half += matrix[i][j];
        }

        matrix[i][n / 2] = abs(sum_first_half - sum_second_half);
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
