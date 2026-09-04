// The dimensions of one matrix (m,n <= 100), and then the elements of the matrix are entered from the keyboard.
// Make a transformation of the matrix so that the middle element in each column is replaced by the difference (by absolute value)
// of the sum of the elements in the first half of the column and the sum of the elements in the second half of the column.
// If the matrix has even number of rows, the value of the middle two elements should be changed.
// The middle element(s) are included when calculating the sum (in the case of an odd number of rows,
// the middle element is included when calculating both of the sums (upper and lower sum)!).
// Print the transformed matrix on the standard output.
//
// Example
//
// Input:
// 4 4
// 13−54210210723532103
//
// Output:
// 15542001071153883
//
// For example:
// Input
// 6 5
// 0 -5 0 -100 -10
// 0 0 0 -30 0
// 0 0 0 -20 22
// 0 0 45 0 0
// 0 4 -23 0 14
// 0 -2 11 0 0
//
// Result
// 0 -5 0 -100 -10
// 0 0 0 -30 0
// 0 7 33 150 2
// 0 7 33 150 2
// 0 4 -23 0 14
// 0 -2 11 0 0
#include <iostream>
using namespace std;

int main() {
	int m, n;
	cin >> m >> n;

	int a[100][100];

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
		}
	}

	for (int j = 0; j < n; j++) {
		int f_half_sum = 0;
		int s_half_sum = 0;
		int mid = m % 2 == 0 ? m / 2 : (m + 1) / 2;

		for (int i = 0; i < mid; i++) {
			f_half_sum += a[i][j];
		}

		for (int i = mid; i < m; i++) {
			s_half_sum += a[i][j];
		}

		int difference = abs(f_half_sum - s_half_sum);

		if (m % 2 == 0) {
			a[mid - 1][j] = difference;
			a[mid][j] = difference;
		} else {
			a[mid][j] = difference;
		}
	}

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}
}
