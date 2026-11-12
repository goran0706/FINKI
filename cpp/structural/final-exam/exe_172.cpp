// Write a program where a matrix A read from SI (maximum value of dimensions of the matrix is 100) is transformed to a new matrix B.
// Each element of the new matrix B is sum of positive neighbors of the corresponding element of the matrix A.
// Print the new matrix B on the standard output.
//
// Input A:
// 14−312−1−423−21010
//
// Output B:
// 61524612112131012
//
// For example:
// Input
// 2 3
// 1 -5 -9
// -2 3 8
//
// Result
// 0 4 8
// 4 8 3

#include <iostream>
using namespace std;

int main() {
	int n, m;
	cin >> n >> m;

	int A[100][100];

	// Read Matrix A
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			cin >> A[i][j];
		}
	}

	int B[100][100] = {0};

	// Calculate Matrix B - all 8 neighbours
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			int sum = 0;

			for (int k = i - 1; k <= i + 1; k++) {
				for (int l = j - 1; l <= j + 1; l++) {
					// Skip self
					if (k == i && l == j) {
						continue;
					}

					// Check out-of-bounds
					if (k >= 0 && k < n && l >= 0 && l < m) {
						if (A[k][l] > 0) {
							sum += A[k][l];
						}
					}
				}
			}

			B[i][j] = sum;
		}
	}

	// Calculate Matrix B - only 4 neighbours UP, RIGHT, DOWN, LEFT
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			int sum = 0;

			// 1. Check UP neighbor
			if (i - 1 >= 0 && A[i - 1][j] > 0) {
				sum += A[i - 1][j];
			}
			// 2. Check DOWN neighbor
			if (i + 1 < n && A[i + 1][j] > 0) {
				sum += A[i + 1][j];
			}
			// 3. Check LEFT neighbor
			if (j - 1 >= 0 && A[i][j - 1] > 0) {
				sum += A[i][j - 1];
			}
			// 4. Check RIGHT neighbor
			if (j + 1 < m && A[i][j + 1] > 0) {
				sum += A[i][j + 1];
			}

			B[i][j] = sum;
		}
	}

	// Print Matrix B
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			cout << B[i][j] << " ";
		}
		cout << endl;
	}
}
