// ──────────────────────────────────────────────────────────
// ЗАДАЧА 29  (zad29.cpp)
// ──────────────────────────────────────────────────────────
// Се дефинира функција  f(n, m):
//   - Ако m == 0: враќа n * 10
//   - Инаку: враќа n * (10^цифри(m)) + m
//   (т.е. го "залепува" m десно до n)
//   Пример: f(3, 45) = 345, f(1, 0) = 10
//
// Се читаат N (редови) и M (колони), па N×M матрица.
// За секоја колона j (0 до M-1), да се избројат колку елементи matrix[i][j] се еднакви на f(i, j).
// Да се испечати бројот за секоја колона, по еден на ред.
//
// Пример (N=2, M=2):
//   Матрица:
//     10 12
//     21 22
//   f(0,0)=0*10=0, f(1,0)=10 → col0: 1 (само matrix[1][0]=21≠10... )
//   Излез:
//     1
//     0

#include <iostream>
using namespace std;

int digits(int n) {
	if (n == 0) return 1;
	int count = 0;
	while (n > 0) {
		count++;
		n /= 10;
	}
	return count;
}

int pow10(int m) {
	int result = 1;
	for (int i = 0; i < m; i++) {
		result *= 10;
	}
	return result;
}

int f(int n, int m) {
	if (m == 0) return n * 10;
	return n * pow10(digits(m)) + m;
}

int main() {
	int N, M;
	cin >> N >> M;

	int a[100][100];

	for (int i = 0; i < N; i++) {
		for (int j = 0; j < M; j++) {
			cin >> a[i][j];
		}
	}

	for (int j = 0; j < M; j++) {
		int count = 0;
		for (int i = 0; i < N; i++) {
			int val = f(i, j);
			if (a[i][j] == val) {
				count++;
			}
		}
		cout << count << endl;
	}

	return 0;
}
