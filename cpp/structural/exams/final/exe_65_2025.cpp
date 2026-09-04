// ──────────────────────────────────────────────────────────
// ЗАДАЧА 14  (zad14.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N линии текст (до 50 знаци).
// Да се испечатат сите линии во кои пониската (lowercase) верзија на линијата ја содржи поднизата "a1c" барем 2 пати.
//
// Влез:  N, па N линии
// Излез: секоја линија (со оригинално пишување) на нов ред
//
// Пример:
// Влез :
// 2
// A1Cxxa1c
// hello
//
// Излез:
// a1cxxa1c   (испечатена во мали букви)

#include <cstring>
#include <iostream>
using namespace std;

void substring() {
	// =============================================================
	// 1. Find a Substring
	// =============================================================
	const char text[] = "Learning C++ is awesome.";
	const char search_target[] = "C++";

	if (strstr(text, search_target) != nullptr) {
		cout << "Substring found.\n";
	}


	// =============================================================
	// 2. Find the Occurrences
	// =============================================================
	const char haystack[] = "thrice mice ice cream, ice everywhere";
	const char needle[] = "ice";

	int count = 0;
	int haystack_len = strlen(haystack);
	int needle_len = strlen(needle);

	for (int i = 0; i <= haystack_len - needle_len; i++) {
		if (strstr(&haystack[i], needle) == &haystack[i]) {
			count++;
			i += needle_len - 1;
		}
	}
}

bool is_substring(const char str[], const char sub[]) {
	// 1. Пробај ја секоја позиција во str како можен почеток
	for (int i = 0; str[i] != '\0'; i++) {
		// 2. Почни да ја споредуваш поднизата од почеток
		int j = 0;

		// 3. Додека знаците се исти, продолжи понатаму
		while (sub[j] != '\0' && str[i + j] == sub[j]) {
			j++;
		}

		// 4. Ако стигнавме до крајот на sub, значи целата подниза се совпаднала
		if (sub[j] == '\0') {
			return true;
		}
	}

	// 5. Не ја најдовме поднизата никаде
	return false;
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	for (int i = 0; i < n; i++) {
		char str[51];
		cin.getline(str, 51);

		for (int j = 0; str[j] != '\0'; j++) {
			str[j] = tolower(str[j]);
		}

		int count = 0;

		// SOLUTION 1:
		for (int j = 0; str[j + 2] != '\0'; j++) {
			if (str[j] == 'a' && str[j + 1] == '1' && str[j + 2] == 'c') {
				count++;
			}
		}

		// SOLUTION 2:
		for (int j = 0; str[j + 2] != '\0'; j++) {
			if (strncmp(str + j, "a1c", 3) == 0) {
				count++;
			}
		}

		// SOLUTION 3:
		for (int j = 0; str[j + 2] != '\0'; j++) {
			if (is_substring(str, "a1c")) {
				count++;
			}
		}

		if (count >= 2) {
			cout << str << endl;
		}
	}

	return 0;
}


