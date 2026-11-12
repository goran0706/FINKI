// Read from standard input the dimensions of a matrix (m < 100 and n < 100) which contains only zeros and ones.
// Then read the elements of the matrix.
//
// Read the coordinates of one element of the matrix.
// If the element of the read position is 0, then it should become 1 and:
//
//     all zeros above that element to the first element with value 1 or to the start of the column,
//     all zeros bellow that element to the first element with value 1 or to the end of the column,
//     all zeros left from that element to the first element with value 1 or to the begin of the row and
//     all zeros right from that element to the first element with value 1 or to the end of the row.
//
// If the element of the given position is 1 than the matrix stays unchanged.
//
// Print the changed matrix.
//
// Example:
//
// For given matrix Аm,n:
//
// ⎛⎝⎜⎜⎜⎜⎜⎜⎜⎜⎜⎜⎜101100110011111000100100100011100001010000⎞⎠⎟⎟⎟⎟⎟⎟⎟⎟⎟⎟⎟
//
// and coordinates 1 and 2 (the red element) the result matrix is:
//
// ⎛⎝⎜⎜⎜⎜⎜⎜⎜⎜⎜⎜⎜111100111011111111100110100011100001010000⎞⎠⎟⎟⎟⎟⎟⎟⎟⎟⎟⎟⎟
//
// For example:
// Input
// 7 6
// 1 1 1 1 1 1
// 0 0 0 0 1 0
// 1 0 0 0 1 1
// 1 1 0 1 0 0
// 0 1 1 0 0 0
// 0 1 0 0 0 0
// 1 1 0 0 0 0
// 5 5
//
// Result
// 1 1 1 1 1 1
// 0 0 0 0 1 0
// 1 0 0 0 1 1
// 1 1 0 1 0 1
// 0 1 1 0 0 1
// 0 1 1 1 1 1
// 1 1 0 0 0 1
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

	int pos_x, pos_y;
	cin >> pos_x >> pos_y;

	if (a[pos_x][pos_y] == 0) {
		a[pos_x][pos_y] = 1;

		// 1. Move UP (decrement row)
		for (int i = pos_x - 1; i >= 0; i--) {
			if (a[i][pos_y] != 0) {
				break;
			}
			a[i][pos_y] = 1;
		}

		// 2. Move DOWN (increment row up to m)
		for (int i = pos_x + 1; i < m; i++) {
			if (a[i][pos_y] != 0) {
				break;
			}
			a[i][pos_y] = 1;
		}

		// 3. Move LEFT (decrement column)
		for (int j = pos_y - 1; j >= 0; j--) {
			if (a[pos_x][j] != 0) {
				break;
			}
			a[pos_x][j] = 1;
		}

		// 4. Move RIGHT (increment column up to n)
		for (int j = pos_y + 1; j < n; j++) {
			if (a[pos_x][j] != 0) {
				break;
			}
			a[pos_x][j] = 1;
		}
	}

	// Print the result matrix
	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}

	return 0;
}
