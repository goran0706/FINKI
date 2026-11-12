/*
    ============================================================
    TASK 13
    ============================================================
    Редици од матрица се заменуваат со:
     1  ако збир > X
    -1  ако збир < X
     0  ако збир = X
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

    int x;
    cin >> x;

    for (int i = 0; i < n; i++) {
        int sum = 0;

        for (int j = 0; j < m; j++) {
            sum += matrix[i][j];
        }

        for (int j = 0; j < m; j++) {
            if (sum > x) {
                matrix[i][j] = 1;
            } else if (sum < x) {
                matrix[i][j] = -1;
            } else {
                matrix[i][j] = 0;
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
