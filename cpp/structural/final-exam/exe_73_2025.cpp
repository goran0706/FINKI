// ──────────────────────────────────────────────────────────
// ЗАДАЧА 22  (zad22.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N линии текст.
// Да се најде најдолгата линија која е:
//   1. Палиндром, И
//   2. Содржи барем еден специјален (не-алфанумерички) знак.
// Ако не постои, се печати "Nema!".
//
// Влез:  N, па N линии (до 80 знаци)
// Излез: линијата, или "Nema!"

#include <iostream>
#include <cstring>
using namespace std;

bool is_palindrome(const char *str) {
	int n = strlen(str);

	for (int i = 0; i < n / 2; i++) {
		if (str[i] != str[n - 1 - i]) {
			return false;
		}
	}

	return true;
}

bool has_special(const char *str) {
	for (int i = 0; str[i] != '\0'; i++) {
		if (!isalpha(str[i])) {
			return true;
		}
	}

	return false;
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	int max_length = 0;
	char str[80] = "";

	for (int i = 0; i < n; i++) {
		char tmp[80];
		cin.getline(tmp, 80);

		if (is_palindrome(tmp) && has_special(tmp)) {
			int curr_length = strlen(tmp);

			if (curr_length > max_length) {
				max_length = curr_length;
				strcpy(str, tmp);
			}
		}
	}

	if (str[0] == '\0') {
		cout << "Nema!" << endl;
	} else {
		cout << str << endl;
	}

	return 0;
}
