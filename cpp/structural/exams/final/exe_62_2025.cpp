// ──────────────────────────────────────────────────────────
// ЗАДАЧА 8  (zad8.cpp)
// ──────────────────────────────────────────────────────────
// Се чита цел број N.
// Рекурзивно да се испечати следниов шаблон:
//
//   Ред 1 : 1
//   Ред 2 : 1 2 1
//   Ред 3 : 1 1 3 1 1
//   ...
//   Ред i : (i-1) единици, потоа бројот i, па (i-1) единици
//
// Пример (N=3):
//   1
//   1 2 1
//   1 1 3 1 1
#include <iostream>
using namespace std;

void print_ones(int k) {
	if (k == 0) return;

	cout << "1 ";
	print_ones(k - 1);
}


void print_rows(const int n) {
	if (n <= 0) return;

	print_rows(n - 1);	// Anything bellow this recursive call reverts n, meaning start from 1
	print_ones(n - 1);	// prints 1 left of n
	cout << n << " ";		// prints n
	print_ones(n - 1);	// prints 1 right of n
	cout << endl;			// prints new line
}

int main() {
	int n;
	cin >> n;

	print_rows(n);

	return 0;
}
