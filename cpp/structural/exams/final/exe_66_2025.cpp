// ──────────────────────────────────────────────────────────
// ЗАДАЧА 15  (zad15.cpp)
// ──────────────────────────────────────────────────────────
// Цезарова шифра (Caesar Cipher).
// Се читаат N (број на линии) и X (поместување).
// За секоја линија, секоја буква (мала или голема) се поместува за X позиции во абецедата
// (циркуларно, зачувувајќи ги малите/големите букви).
// Нe-буквите остануваат непроменети.
//
// Влез:
//   Прв ред : N X
//   Следните N редови : линии текст
// Излез: N шифрирани линии
//
// Пример:
//   Влез : 1 3
//          Hello World!
//   Излез: Khoor Zruog!

#include <iostream>
using namespace std;

int main() {
	int n, x;
	cin >> n >> x;
	cin.ignore();

	for (int i = 0; i < n; i++) {
		char str[101];
		cin.getline(str, 101);

		for (int j = 0; str[j] != '\0'; j++) {
			if (str[j] >= 'A' && str[j] <= 'Z') {
				// Starting point of an UPPERCASE + 0-25 places with wrap-around
				str[j] = 'A' + (str[j] - 'A' + x) % 26;
			} else if (str[j] >= 'a' && str[j] <= 'z') {
				// Starting point of a lowercase + 0-25 places with wrap-around
				str[j] = 'a' + (str[j] - 'a' + x) % 26;
			}
		}

		cout << str << endl;
	}

	return 0;
}
