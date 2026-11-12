// From SI are read dimension and elements of square matrix (MAX 100x100) of integers.
//
// Create a new matrix where each element of the main diagonal will be replaced with the sum of all elements from the
// same row right from the element and elements from the same column over the element.
//
// Also replace each element of the antidiagonal with the sum of all elements from the same row before
// the element and elements from the same column below the element.
//
// The blue red elements are part of the main diagonal, the blue elements are part of antidiagonal,
// and the element in purple is part of both diagonals.
//
// If there is no such elements, the element is 0. If some element is on both diagonals, both sums are summed.
//
// Example:
//
// For given matrix Аn,n:
// ⎛⎝⎜147258369⎞⎠⎟
//
// The result:
// ⎛⎝⎜54022081869⎞⎠⎟
//
// For example:
// Input
//
// 4
// 1 1 1 1
// 2 2 2 2
// 3 3 3 3
// 4 4 4 4
//
// Result
// 3 1 1 12
// 2 5 11 2
// 3 7 6 3
// 0 4 4 6

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100][100];
	int transformed[100][100];

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
			transformed[i][j] = a[i][j];
		}
	}

	for (int i = 0; i < n; i++) {
		// 1. Main diagonal: row i, column i
		int main_sum = 0;
		for (int c = i + 1; c < n; c++) main_sum += a[i][c]; // Right
		for (int r = i - 1; r >= 0; r--) main_sum += a[r][i]; // Above

		// 2. Antidiagonal: row i, column n - 1 - i
		int anti_sum = 0;
		for (int c = n - 1 - i - 1; c >= 0; c--) anti_sum += a[i][c]; // Left
		for (int r = i + 1; r < n; r++) anti_sum += a[r][n - 1 - i]; // Below

		// 3. Transform
		transformed[i][i] = main_sum;
		transformed[i][n - 1 - i] = anti_sum;
		if (i == n - 1 - i) transformed[i][i] = main_sum + anti_sum;
	}

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << transformed[i][j] << " ";
		}
		cout << endl;
	}
}
