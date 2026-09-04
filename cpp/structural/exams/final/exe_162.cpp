// Z-diagonal of given square matrix is composed of the elements of the first row, the elements of the supportive diagonal,
// and the elements of the last row (marked with blue color on the example).
//
// From SI read the dimensions of square matrix (integer N, N > 2, N<100), and the elements of the matrix (real numbers).
// Store the elements of the Z-diagonal in a array, starting from the first row, continuing with the supportive diagonal,
// and finishing with the last row (the last element of the first row is the same element with the first element of the supportive diagonal,
// and the last element of the supportive diagonal is the same as the first element of the last row,
// and these elements should be stored only once). The resulted array should be printed on the SO.
// Then print the original matrix, but with the elements of Z-diagonal in reverse order.
//
// 58344.15.595.14.15.5621.337.40.71.213227
//
// Example:
//
// Input:
// 4
// 5 5.5 6 1.2
// 8  95.1 21.3 13
// 34 4.1 37.4  22
// 4.1 5.5 0.7 7
//
// Output:
// 5.00 5.50 6.00 1.20 21.30 4.10 4.10 5.50 0.70 7.00
// 7.00 0.70 5.50 4.10
// 8.00 95.10 4.10 13.00
// 34.00 21.30 37.40 22.00
// 1.20 6.00 5.50 5.00
//
// For example:
// Input
// 4
// 5 5.5 6 1.2
// 8 95.1 21.3 13
// 34 4.1 37.4 22
// 4.1 5.5 0.7 7
//
// Result
// 5 5.5 6 1.2 21.3 4.1 4.1 5.5 0.7 7
// 7 0.7 5.5 4.1
// 8 95.1 4.1 13
// 34 21.3 37.4 22
// 1.2 6 5.5 5
#include <iostream>
using namespace std;

int main() {
	int n;
	if (!(cin >> n)) return 0;

	float m[100][100];
	float a[300];
	int write = 0;

	// 1. Read the matrix
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cin >> m[i][j];
		}
	}

	// 2. Extract First Row
	for (int j = 0; j < n; j++) {
		a[write++] = m[0][j];
	}

	// 3. Extract Supportive Diagonal (excluding the corners already taken)
	for (int i = 1; i < n - 1; i++) {
		a[write++] = m[i][n - 1 - i];
	}

	// 4. Extract Last Row
	for (int j = 0; j < n; j++) {
		a[write++] = m[n - 1][j];
	}

	// Print the Z-diagonal array
	for (int i = 0; i < write; i++) {
		cout << a[i] << (i == write - 1 ? "" : " ");
	}
	cout << endl;

	// 5. Overwrite the matrix with reversed elements.

	// Reverse First Row
	for (int j = 0; j < n; j++) {
		m[0][j] = a[--write];
	}

	// Reverse Supportive Diagonal
	for (int i = 1; i < n - 1; i++) {
		m[i][n - 1 - i] = a[--write];
	}

	// Reverse Last Row
	for (int j = 0; j < n; j++) {
		m[n - 1][j] = a[--write];
	}

	// 6. Print the modified matrix
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << m[i][j] << (j == n - 1 ? "" : " ");
		}
		cout << endl;
	}

	return 0;
}
