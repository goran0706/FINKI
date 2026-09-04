// TASK 3 - Matrix column analysis
//
// Write a program that reads a matrix of size n x m.
// Using a separate function, calculate the difference between the maximum and minimum element in each column.
// - Print the difference for every column.
// - Determine and print the index of the column that has the largest difference.
#include <iostream>
using namespace std;

int analyzeColumns(int matrix[][100], int n, int m) {
    int largest_diff = -1;
    int largest_diff_col_index = 0;

    for (int j = 0; j < m; j++) {
        int col_min = matrix[0][j];
        int col_max = matrix[0][j];

        for (int i = 0; i < n; i++) {
            int element = matrix[i][j];

            if (element < col_min) {
                col_min = element;
            }

            if (element > col_max) {
                col_max = element;
            }
        }

        int current_diff = col_max - col_min;
        cout << "Column " << j << " difference: " << current_diff << endl;

        if (current_diff > largest_diff) {
            largest_diff = current_diff;
            largest_diff_col_index = j;
        }
    }

    return largest_diff_col_index;
}

int main() {
    int n, m;
    cin >> n >> m;

    int matrix[100][100];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    int largest_col = analyzeColumns(matrix, n, m);
    cout << "Column with the largest difference: " << largest_col << endl;

    return 0;
}
