/*
    Од стандарден влез се вчитуваат 2 броја M и N, кои ја означуваат димензијата на матрицата,
    MxN и потоа се внесуваат елементите во матрицата.

    Вашате задача е последниот елемент во секој од редовите на матрицата, да го замените со максималниот елемент од таа редица.
    На крај испечатете ја изменетата матрица и во нов ред среданта свредност на изменетата матицата.

    Input
    3 4
    1 5 6 7
    5 4 7 3
    5 5 7 7

    Output
    1 5 6 7
    5 4 7 7
    5 5 7 7
    5.5
*/

#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int matrix[n][m];
    int max = matrix[0][0];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
            if (matrix[i][j] > max) {
                max = matrix[i][j];
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (
                i == 0 && j == 0 ||
                i == 0 && j == m - 1 ||
                i == n - 1 && j == 0 ||
                i == n - 1 && j == m - 1
            ) {
                matrix[i][j] = max;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
