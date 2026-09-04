// Write a program that reads matrix with dimensions MxN (max. 100x100).
// At the beginning the dimensions are read, and then the elements of the matrix with values 0 or 1.
// Your program should count and print on SO the number of rows and columns with at least 3 consecutive appearance of elements with value 1.
//
// Example:
//
// 111100110011
//
// 1 row + 1 column = 2
//
// For example:
// Input 	Result
//
// 10 4
// 0 0 0 1
// 0 1 0 0
// 0 0 0 1
// 1 0 0 0
// 0 0 0 1
// 1 0 0 1
// 0 1 0 0
// 1 0 1 1
// 0 1 1 0
// 1 0 1 1
#include <iostream>
using namespace std;

int main() {
	int m, n;
	if (!(cin >> m >> n)) return 0;

	int a[100][100] = {0};

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
		}
	}

	int total_count = 0;

	for (int i = 0; i < m; i++) {
		int count = 0;
		for (int j = 0; j < n; j++) {
			if (a[i][j] == 1) {
				count++;
				if (count >= 3) {
					total_count++;
					break;
				}
			} else {
				count = 0;
			}
		}
	}

	for (int j = 0; j < n; j++) {
		int count = 0;
		for (int i = 0; i < m; i++) {
			if (a[i][j] == 1) {
				count++;
				if (count >= 3) {
					total_count++;
					break;
				}
			} else {
				count = 0;
			}
		}
	}

	cout << total_count << endl;
	return 0;
}
