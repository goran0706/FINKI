// ──────────────────────────────────────────────────────────
// ЗАДАЧА 36  (zad36.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат линии текст до "0" (единствена нула на редот).
// Да се најде НАЈДОЛГАТА линија (по должина) меѓу сите прочитани линии.
// Ако повеќе линии имаат иста должина, се зема последно прочитаната.
// Потоа да се испечати поднизата на таа линија помеѓу ПРВАТА цифра и ПОСЛЕДНАТА цифра (вклучително).
//
// Влез:  линии текст (завршуваат со "0")
// Излез: поднизата меѓу прва и последна цифра на најдолгата линија
//
// Пример:
//   Влез:
//     hello3world7end
//     ab1cd
//     0
//   Излез: 3world7
#include <cstring>
#include <iostream>
using namespace std;

int main() {
	char str[100];

	int max = 0;
	char longest[100] = "";

	while (cin.getline(str, 100)) {
		if (str[0] == '0') {
			break;
		}

		int current_length = strlen(str);

		if (current_length > max) {
			max = current_length;
			strcpy(longest, str);
		}
	}

	bool found_first = false;

	for (int i = 0; longest[i] != '\0'; i++) {
		if (isdigit(longest[i])) {
			if (!found_first) {
				cout << longest[i];
				found_first = true;
			} else {
				cout << longest[i];
				break;
			}
		} else if (found_first) {
			cout << longest[i];
		}
	}

	return 0;
}
