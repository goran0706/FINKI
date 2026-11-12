// Matrici
// Da se vnesi m i n za redici i koloni, a potoa i elementite na matricata.
// Se crta shablon kako bukvata N koja pocnuva vo opsek (2x2) i zbirot na broevite sto gi opfakja.
// Potoa da se pecati zbirot na shablonot vo opsek (3x3) itn

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

    int k_size = n < m ? n : m;

    // BAD
    for (int k = 2; k <= k_size; k++) {
        int current_sum = 0;

        // Се движиме само во рамките на моменталниот K x K опсег (од 0 до K-1)
        for (int i = 0; i < k; i++) {
            for (int j = 0; j < k; j++) {
                // Услов за буквата N: прва колона ИЛИ последна колона ИЛИ главна дијагонала
                if (j == 0 || j == k - 1 || i == j) {
                    current_sum += matrix[i][j];
                }
            }
        }

        cout << "Sum (" << k << "x" << k << ") is: " << current_sum << endl;
    }

    // GOOD
    for (int k = 2; k <= k_size; k++) {
        int current_sum = 0;

        for (int i = 0; i < k; i++) {
            current_sum += matrix[i][0];
        }

        for (int i = 0; i < k; i++) {
            current_sum += matrix[k - 1][i];
        }

        for (int i = 1; i < k - 1; i++) {
            current_sum += matrix[i][i];
        }

        cout << "Sum (" << k << "x" << k << ") is: " << current_sum << endl;
    }

    return 0;
}
