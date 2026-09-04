// За дадени од влез индекси на редици, да се испечати онаа редица која содржи како елементи
// најголем број на n-цифрени броеви (n се внесува од стандарден влез).
// Доколку има повеќе такви редици, се печати последно најдената.
// Од стандарден влез се задаваат димензиите на една матрица Аmxn(m, n <= 100),
// а во продолжение се читаат елементите на матрицата.
// Елементите на матрицата се цели броеви.
// Потоа се внесува цел број N(N <= 100), а во продолжение N индекси кои ги означуваат соодветните редици на матрицата
// На крај се внесува еден број n, кој означува колку цифрени броеви да се бараат во соодветните редици на матрицата

#include <iostream>
#include <cmath>
using namespace std;

int count_digits(int n) {
	if (n == 0) return 1;
	n = abs(n);

	int count = 0;

	while (n > 0) {
		count++;
		n /= 10;
	}

	return count;
}

int main() {
	int m, n;
	cin >> m >> n;

	int a[100][100];
	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
		}
	}

	int N;
	cin >> N;

	int indexes[100];
	for (int i = 0; i < N; i++) {
		cin >> indexes[i];
	}

	int digits;
	cin >> digits;

	int read = 0;
	int max_count = -1;
	int target_row = -1;

	for (int i = 0; i < m; i++) {
		if (read >= N || i != indexes[read]) {
			continue;
		}

		int cur_count = 0;

		for (int j = 0; j < n; j++) {
			if (digits == count_digits(a[i][j])) {
				cur_count++;
			}
		}

		if (cur_count >= max_count) {
			max_count = cur_count;
			target_row = i;
		}

		read++;
	}

	for (int j = 0; j < n; j++) {
		cout << a[target_row][j] << " ";
	}
}
