/*
    ============================================================
    TASK 11 — Matrix N Contour Sum
    ============================================================
    Исто како TASK 8, но со шаблон на буквата N.

    Секој елемент M[i][j] е збир на елементите кои ја формираат буквата N со почеток во A[i][j].
*/
#include <iostream>
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;

    int size;
    cin >> size;

    int A[100][100];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
        }
    }

    int M[100][100];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (size >= 2 && i + size <= m && j + size <= n) {
                int sum = 0;

                for (int k = 0; k < size; k++) {
                    sum += A[k][0]; // left col
                }
                for (int k = 1; k < size - 1; k++) {
                    sum += A[k][size - 1 - k]; // middle diagonal
                }
                for (int k = 0; k < size; k++) {
                    sum += A[k][size - 1]; // right col
                }

                M[i][j] = sum;
            } else {
                M[i][j] = A[i][j];
            }
        }
    }

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << M[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
