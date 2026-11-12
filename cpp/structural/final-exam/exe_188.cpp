// За даден природен број N, да се пополни матрица N x N со буквите A, B, C, D, E, F, G, H, I по редови, во змијовиден (цик-цак) облик, односно:
// редовите со парен индекс (0, 2, 4, ...) се пополнуваат од лево кон десно
// редовите со непарен индекс (1, 3, 5, ...) се пополнуваат од десно кон лево
// Буквите се користат циклично и по редослед, т.е. после буквата I, се продолжува пак од А.
// ---------------------------------
//
// Given a natural number N, fill an N x N matrix with the letters A, B, C, D, E, F, G, H, I in order, row by row, in a zig-zag (snake-like) pattern, as follows:
// Rows with an even index (0, 2, 4, …) are filled from left to right.
// Rows with an odd index (1, 3, 5, …) are filled from right to left.
// The letters are used cyclically and in order - that is, after I, the sequence continues again from A.
//
// For example:
// Input
// 4
//
// Result
// A B C D
// H G F E
// I A B C
// G F E D

// Input
// 5
//
// Result
// A B C D E
// A I H G F
// B C D E F
// B A I H G
// C D E F G
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int count = 0;
	char ch[] = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'};
	char a[100][100];

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			if (count == 9) count = 0;
			if (i % 2 == 0) {
				a[i][j] = ch[count++];
			} else {
				a[i][n - 1 - j] = ch[count++];
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
