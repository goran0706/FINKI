// Да се напише програма која за матрица внесена од тастатура
// ќе ги замени елементите од главната дијагонала со разликата од максималниот и минималниот елемент во матрицата.
// Резултантната матрица да се испечати на екран.

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

    int min = matrix[0][0];
    int max = matrix[0][0];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (min > matrix[i][j]) {
                min = matrix[i][j];
            }
            if (max < matrix[i][j]) {
                max = matrix[i][j];
            }
        }
    }

    int dif = max - min;

    for (int i = 0; i < n; i++) {
        matrix[i][i] = dif;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
