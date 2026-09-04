// Да се напише програма која за матрица внесена од тастатура
// ќе ја пресмета разликата на збирот на елементите на непарните колони и збирот на елементите на парните редици.
// Матрицата не мора да биде квадратна.

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

    int sum_odd_cols = 0;
    int sum_even_rows = 0;

    // 1. First approach
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (i % 2 == 0) {
                sum_even_rows += matrix[i][j];
            }
            if (j % 2 != 0) {
                sum_odd_cols += matrix[i][j];
            }
        }
    }

    cout << "Difference: " << sum_odd_cols - sum_even_rows << endl;

    sum_even_rows = 0;
    sum_odd_cols = 0;

    // 2. Second approach
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            for (int j = 0; j < m; j++) {
                sum_even_rows += matrix[i][j];
            }
        }
        for (int j = 0; j < m; j++) {
            if (j % 2 != 0) {
                sum_odd_cols += matrix[i][j];
            }
        }
    }

    cout << "Difference: " << sum_odd_cols - sum_even_rows << endl;

    return 0;
}
