// За даден природен број N, да се пополни матрица N x N со цифрите 1, 2, 3… 9, 0, по редови, во змијовиден (цик-цак) облик, односно:
// редовите со парен индекс (0, 2, 4, ...) се пополнуваат од лево кон десно
// редовите со непарен индекс (1, 3, 5, ...) се пополнуваат од десно кон лево
// Цифрите се користат циклично и по редослед.
// ---------------------------------
//
// Given a natural number N, fill an N x N matrix with the digits 1, 2, 3, …, 9, 0 in order, row by row, in a zig-zag (snake-like) pattern, as follows:
// Rows with an even index (0, 2, 4, …) are filled from left to right.
// Rows with an odd index (1, 3, 5, …) are filled from right to left.
// The digits are used cyclically and in order (i.e., after 9 comes 0, then 1 again, etc.).
//
// For example:
// Input
// 4
//
// Result
// 1 2 3 4
// 8 7 6 5
// 9 0 1 2
// 6 5 4 3

// Input
// 5
//
// Result
// 1 2 3 4 5
// 0 9 8 7 6
// 1 2 3 4 5
// 0 9 8 7 6
// 1 2 3 4 5
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100][100];
	int count = 1;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			if (count > 9) count = 0;
			if (i % 2 == 0) {
				a[i][j] = count++;
			} else {
				a[i][n - 1 - j] = count++;
			}
		}
	}

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}
}
