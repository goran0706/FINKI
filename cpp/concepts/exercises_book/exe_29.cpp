// 6. Do Programming Exercise 5 but use a two-dimensional array to store input for 3 years of monthly sales.
// Report the total sales for each individual year and for the combined years.

#include <iostream>
using namespace std;

const int RowSize = 3;
const int ColSize = 12;

int main() {
    int salesMatrix[RowSize][ColSize];

    // for loop
    // outer = rows
    // inner = cols
    for (int row = 0; row < RowSize; row++) {
        for (int col = 0; col < ColSize; col++) {
            cout << "Enter book sales for " << col + 1 << ": ";
            cin >> salesMatrix[row][col]; // row = year; col = month
        }
    }

    // for range
    for (auto &row: salesMatrix) {
        int sum = 0;
        for (int col: row) sum += col;
        cout << "Total sales for the year " << row << ": " << sum << endl;
    }
}
