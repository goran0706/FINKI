// ──────────────────────────────────────────────────────────
// ЗАДАЧА 25  (zad25.cpp)
// ──────────────────────────────────────────────────────────
// Идентична логика со Задача 18:
// Се читаат N, M, R, K, па N×M матрица.
// Се наоѓа минималниот елемент и се пополнува горната лева под-матрица R×K со него.
// Се печати модифицираната матрица.
//
// Влез:  N M, R K, па N×M матрица
// Излез: модифицирана N×M матрица

#include <iostream>
using namespace std;

int main() {
	int n, m, r, k;
	cin >> n >> m >> r >> k;

	int a[100][100];
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			cin >> a[i][j];
		}
	}

	// 1. Find min
	int min = a[0][0];
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (a[i][j] < min) {
				min = a[i][j];
			}
		}
	}

	// 2. Transform
	for (int i = 0; i <= r; i++) {
		for (int j = 0; j <= k; j++) {
			a[i][j] = min;
		}
	}

	// 3. Print
	for (int i = 0; i <= r; i++) {
		for (int j = 0; j <= k; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}

	return 0;
}
