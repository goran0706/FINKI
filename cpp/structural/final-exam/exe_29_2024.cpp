/*
    ============================================================
    TASK 14
    ============================================================
    Матрица Nx(2N) → (2N)xN
    Десната половина се префрла под матрицата.
*/
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[100][100];
    int b[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n * 2; j++) {
            cin >> a[i][j];
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            b[i][j] = a[i][j];
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n * 2; j++) {
            b[n + i][j] = a[i][n + j];
        }
    }

    for (int i = 0; i < n * 2; i++) {
        for (int j = 0; j < n; j++) {
            cout << b[i][j] << " ";
        }
        cout << endl;
    }
}
