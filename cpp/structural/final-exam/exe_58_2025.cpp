// Vtorata zadacha ja nemam, no kolku shto se sekjavam beshe so matrica i so dadoteki.
// Trebashe da se soberat sosednite elementi na element vo matricata i mislam da se zapishe vo dadoteka.
//
// Mislam neshto vakov vlez
//
// 3
// 1 2 3
// 4 5 6
// 7 8 9
//
// Izlez:
//
// 12 21 16
// 27 45 33
// 24 39 28
//
// 1 => 12 = 1 + 2 + 4 + 5
// 2  => 21 = 2 + 1 + 4 + 5 + 6 + 3
// itn...
//
// 5 => 45 = 5 + 1 + 2 + 3 + 4 + 6 + 7 + 8 + 9
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100][100];

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
		}
	}

	int transformed[n][n];

	// Solution 1:
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			int sum = a[i][j];									// center

			if (i > 0) sum += a[i - 1][j];						// top
			if (i < n - 1) sum += a[i + 1][j];					// bottom
			if (j > 0) sum += a[i][j - 1];						// left
			if (j < n - 1) sum += a[i][j + 1];					// right

			if (i > 0 && j > 0) sum += a[i - 1][j - 1];			// top-left
			if (i > 0 && j < n - 1) sum += a[i - 1][j + 1];		// top-right
			if (i < n - 1 && j > 0) sum += a[i + 1][j - 1];		// bottom-left
			if (i < n - 1 && j < n - 1) sum += a[i + 1][j + 1]; // bottom-right

			transformed[i][j] = sum;
		}
	}

	// Solution 2:
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			int sum = 0;

			for (int idx_i = -1; idx_i <= 1; idx_i++) {
				for (int idx_j = -1; idx_j <= 1; idx_j++) {
					int ni = i + idx_i;
					int nj = j + idx_j;

					if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
						sum += a[ni][nj];
					}
				}
			}

			transformed[i][j] = sum;
		}
	}

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << transformed[i][j] << " ";
		}
		cout << endl;
	}

	return 0;
}
