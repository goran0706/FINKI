// ──────────────────────────────────────────────────────────
// ЗАДАЧА 24  (zad24.cpp)
// ──────────────────────────────────────────────────────────
// Идентична логика со Задача 14:
// Се читаат N линии (до 50 знаци).
// Да се испечатат сите линии (конвертирани во мали букви) во кои поднизата "a1c" се pojавува барем 2 пати.
// Овој пат пребарувањето е имплементирано рачно (без strstr), но ефектот е ист.
//
// Влез:  N, па N линии
// Излез: линиите (во мали букви) кои ги исполнуваат условите

#include <iostream>
#include <cstring>
#include <cctype>
using namespace std;

int substring_count(const char haystack[], const char needle[]) {
	int haystack_len = strlen(haystack);
	int needle_len = strlen(needle);

	if (needle_len == 0) {
		return 0;
	}

	int count = 0;

	for (int i = 0; i <= haystack_len - needle_len; i++) {
		int j = 0;

		while (needle[j] != '\0' && haystack[i + j] == needle[j]) {
			j++;
		}

		if (needle[j] == '\0') {
			count++;
		}
	}

	return count;
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	char needle[] = "a1c";

	for (int i = 0; i < n; i++) {
		// 1. Read line
		char haystack[51];
		cin.getline(haystack, 51);


		// 2. Convert to lower case to compare
		char str[51];
		for (int j = 0; haystack[j] != '\0'; j++) {
			str[j] = tolower(haystack[j]);
		}


		// 3. Find substring occurrences
		// -- Required Solution
		int count = substring_count(haystack, "a1c");

		// -- Alternative Solution
		// int count = 0;
		// int haystack_len = strlen(haystack);
		// int needle_len = strlen(needle);
		//
		// for (int j = 0; j <= haystack_len - needle_len; j++) {
		// 	if (strstr(&haystack[j], needle) == &haystack[j]) {
		// 		count++;
		// 		j += needle_len - 1;
		// 	}
		// }


		// 4. Print the matching string
		if (count > 2) {
			cout << str << endl;
		}
	}

	return 0;
}
