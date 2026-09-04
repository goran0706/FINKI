// Read the dimensions M and N (not bigger than 100) and the values (whole numbers) of one matrix A_ {MxN} from the standard input.
// Print out the index of the first column that has the smallest sum of all of its elements.
//
// For example:
// Input
// 3 8
// 1 2 3 5 7 11 13 17
// 19 23 29 31 37 41 43 47
// 53 59 61 67 71 73 79 83
//
// Result
// 0
#include <iostream>
#include <climits>
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

	int min = INT_MAX;
	int index = 0;

	for (int j = 0; j < n; j++) {
		int col_sum = 0;

		for (int i = 0; i < m; i++) {
			col_sum += a[i][j];
		}

		if (col_sum < min) {
			min = col_sum;
			index = j;
		}
	}

	cout << index << endl;
}
