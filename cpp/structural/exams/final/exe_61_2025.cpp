// ──────────────────────────────────────────────────────────
// ЗАДАЧА 5  (zad5.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N зборови (без празни места).
// Да се најде НАЈКРАТКИОТ збор кој НЕ е палиндром.
// Ако два збора имаат иста должина, се зема лексикографски поголемиот.
// Ако не постои таков збор, се печати "NEMA".
//
// Влез:  N, па N зборови
// Излез: најкраткиот непалиндром, или "NEMA"
//
// Пример:
//   Влез : 4
//          aba hello world aba
//   Излез: world

#include <cstring>
#include <iostream>
using namespace std;

bool is_palindrome(const char str[]) {
	int n = strlen(str);

	for (int i = 0; i < n / 2; i++) {
		if (str[i] != str[n - 1 - i]) {
			return false;
		}
	}

	return true;
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	char a[100][100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	// Solution:
	int index = -1;

	for (int i = 0; i < n; i++) {
		if (!is_palindrome(a[i])) {
			if (index == -1) {
				index = i;
			} else {
				int prev_len = strlen(a[index]);
				int curr_len = strlen(a[i]);
				if (prev_len >= curr_len && strcmp(a[index], a[i]) < 0) {
					index = i;
				}
			}
		}
	}

	if (index == -1) {
		cout << "NEMA";
	} else {
		cout << a[index];
	}

	return 0;
}
