// ──────────────────────────────────────────────────────────
// ЗАДАЧА 13  (zad13.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N линии текст.
// Да се најде најдолгата линија која е палиндром И содржи барем еден не-алфанумерички знак (специјален знак).
// Ако не постои, се печати "Nema!".
//
// Влез:  N, па N линии (до 80 знаци)
// Излез: линијата, или "Nema!"
//
// Пример:
//   Влез : 3
//          abcba
//          a!b!a
//          racecar
//   Излез: a!b!a
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

bool has_special(const char str[]) {
	for (int i = 0; str[i] != '\0'; i++) {
		if (!isalnum(str[i])) {
			return true;
		}
	}

	return false;
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	int max_len = 0;
	char str[81] = "";

	for (int i = 0; i < n; i++) {
		char tmp[81];
		cin.getline(tmp, 81);

		if (is_palindrome(tmp)) {
			if (has_special(tmp)) {
				int curr_len = strlen(tmp);
				if (curr_len > max_len) {
					max_len = curr_len;
					strcpy(str, tmp);
				}
			}
		}
	}

	if (str[0] == '\0') {
		cout << "NEMA" << endl;
	} else {
		cout << str << endl;
	}

	return 0;
}
