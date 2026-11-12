// Да се напише програма која за матрица внесена од тастатура
// ќе ги замени елементите од главната дијагонала со разликата од максималниот и минималниот елемент во матрицата.
// Резултантната матрица да се испечати на екран.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int matrix[n][n];

    int max = 0;
    int min = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> matrix[i][j];

            if (i == 0 && j == 0) {
                max = matrix[i][j];
                min = matrix[i][j];
            } else if (matrix[i][j] > max) {
                max = matrix[i][j];
            } else if (matrix[i][j] < min) {
                min = matrix[i][j];
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                matrix[i][j] = max - min;
            }
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
