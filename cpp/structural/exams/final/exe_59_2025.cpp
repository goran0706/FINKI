// ──────────────────────────────────────────────────────────
// ЗАДАЧА 1  (zad1.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N линии текст.
// Да се најде НАЈДОЛГИОТ палиндром меѓу нив.
// Ако две линии имаат иста должина, се зема лексикографски помалата.
// Ако не постои ниту еден палиндром, се печати "NEMA".
//
// Влез:
//   Прв ред : N
//   Следните N редови : линии текст (може да содржат празни места)
//
// Излез:
//   Најдолгиот палиндром, или "NEMA"
//
// Пример:
//
// Влез :
// 3
// racecar
// hello
// abcba
//
// Излез:
// racecar

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
		cin.getline(a[i], 100);
	}

	int largest_index = -1;

	for (int i = 0; i < n; i++) {
		if (is_palindrome(a[i])) {
			if (largest_index == -1) {
				largest_index = i;
			} else {
				int curr_len = strlen(a[i]);
				int best_len = strlen(a[largest_index]);

				// 1. If we found new larger string or
				// 2. If lengths are mathing then use strcmp for lexicographic checks
				if (curr_len > best_len || (curr_len == best_len && strcmp(a[i], a[largest_index]) < 0)) {
					largest_index = i;
				}
			}
		}
	}

	if (largest_index == -1) {
		cout << "NEMA" << endl;
	} else {
		cout << a[largest_index] << endl;
	}

	return 0;
}
