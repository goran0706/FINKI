// Kvadratna matrica so samo 1 i 0, da ja najdes sumata na site elementi nad glavnata dijagonala i potoa
// da gi zamenis elementite na glavnata dijagonala so taa suma
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

    int sum_above_main = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Оптимизација: j почнува од i + 1
            sum_above_main += matrix[i][j];
        }
    }

    // for (int i = 0; i < n; i++) {
    //     for (int j = 0; j < n; j++) {
    //         if (i == j) {
    //             matrix[i][j] = sum_above_main;
    //         }
    //     }
    // }

    for (int i = 0; i < n; i++) {
        matrix[i][i] = sum_above_main; // Оптимизација: само еден циклус
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
