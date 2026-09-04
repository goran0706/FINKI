// Пример за вчитување и печатење на матрица

#include <iostream>
using namespace std;

int main() {
    int row_size, col_size;
    cin >> row_size >> col_size;

    int matrix[row_size][col_size];

    for (int row = 0; row < row_size; row++) {
        for (int col = 0; col < col_size; col++) {
            cin >> matrix[row][col];
        }
    }

    for (int row = 0; row < row_size; row++) {
        for (int col = 0; col < col_size; col++) {
            cout << matrix[row][col] << " ";
        }
        cout << endl;
    }

    return 0;
}
