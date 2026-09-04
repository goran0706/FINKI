// ──────────────────────────────────────────────────────────
// ЗАДАЧА 32  (zad32.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат зборови до "#".
// За секој збор, да се најдат сите парови од последователни
// САМОГЛАСКИ (case-insensitive). За секој таков пар да се испечати парот (во мали букви) на нов ред.
// Накрај да се испечати вкупниот број на такви парови.
//
// Самогласки: a, e, i, o, u
//
// Пример:
//   Влез: beautiful #
//   Излез:
//     ea
//     ui
//     2

#include <iostream>
#include <cctype>
using namespace std;

bool is_vowel(const char c) {
	const char lc = tolower(c);
	return lc == 'a' || lc == 'e' || lc == 'i' || lc == 'o' || lc == 'u';
}

int main() {
	char word[100];

	while (cin >> word) {
		if (word[0] == '#') {
			break;
		}

		int pair_count = 0;

		// Solution 1:
		for (int i = 0; word[i] != '\0'; i++) {
			if (is_vowel(word[i]) && is_vowel(word[i + 1])) {
				cout << word[i] << word[i + 1] << endl;
				pair_count++;
			}
		}

		// Solution 2:
		char prev_vowel = '\0';

		for (int i = 0; word[i] != '\0'; i++) {
			if (is_vowel(word[i])) {
				if (prev_vowel) {
					cout << prev_vowel << word[i] << endl;
					prev_vowel = '\0';
					pair_count++;
				} else {
					prev_vowel = word[i];
				}
			}
		}

		cout << pair_count << endl;
	}

	return 0;
}
