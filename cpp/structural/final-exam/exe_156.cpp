// Firstly read the dimension of one matrix (m, n <= 100) from the standard input, and then the elements of the matrix.
// Generate an array (with at most m x n elements) of the elements of the matrix that will contain the elements of each
// row that appear exactly once in that row.
// The order of writing the elements in the array corresponds to the order of the rows and the order of the elements within the row.
// If the newly generated array has no elements, print N, otherwise, print the elements of the array.
//
// Example:
//
// Input:
// 3 6
// 111212223324435536
//
// Output:_
// 1 3 4 5 1 2 3 4 5 6
//
// For example:
// Input
//
// 7
// 5
// 30
// -10
// 45
// -10
// 12
// 23
// 23
// 56
// 78
// 23
// -12
// -12
// 32
// 99
// 0
// -1
// -100
// 33
// 33
// 12
// -7
// -4
// -7
// -4
// -23
// -12
// 78
// 34
// 23
// 98
// 654
// 43
// 56
// 67
// 89
//
// Result
// 30 45 12 56 78 32 99 0 -1 -100 12 -23 -12 78 34 23 98 654 43 56 67 89
#include <iostream>
using namespace std;

int main() {
	int m, n;
	cin >> m >> n;

	int M[100][100];

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cin >> M[i][j];
		}
	}

	int a[m * n];
	int write = 0;

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			bool seen = false;

			for (int k = 0; k < n; k++) {
				if (j == k) continue;
				if (M[i][j] == M[i][k]) seen = true;
			}

			if (!seen) {
				a[write++] = M[i][j];
			}
		}
	}

	for (int i = 0; i < write; i++) {
		cout << a[i] << " ";
	}
}
