// Se vnesuvaat m i n (dimenziite na matricata), potoa se vnesuvaat elementite na matricata, i se vnesuvaat koordinati p, q.
// Tockata vo red p i kolona q ke bide centar na romb. Celta e da se presmeta sumata na elementite vo toj romb.
// Inaku treba nie samite da go najdime najgolemiot romb sto moze da se formira.

#include <iostream>
#include <algorithm>
#include <cmath>
using namespace std;

int main() {
	int m, n, p, q, sum = 0;
	int a[100][100];

	cin >> m >> n;

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			cin >> a[i][j];
		}
	}

	cin >> p >> q;

	// Solution
	int top = p;
	int bottom = m - 1 - p;
	int left = q;
	int right = n - 1 - q;
	int radius = min({top, bottom, left, right});

	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			// == operator sums up the elements on the border of the rhombus
			// <= operator sums up all elements of the rhombus
			if (abs(i - p) + abs(j - q) <= radius) {
				sum += a[i][j];
			}
		}
	}

	cout << sum << endl;

	return 0;
}
