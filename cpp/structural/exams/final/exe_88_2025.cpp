// ──────────────────────────────────────────────────────────
// ЗАДАЧА 37  (zad37.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат линии текст до "#".
// За секоја линија:
//   1. Да се извлечат сите цифри и да се сортираат растечки (bubble sort).
//   2. Да се испечати бројот на цифри, потоа ":", потоа сортираните цифри слепени без разделувач.
//
// Влез:  линии (завршуваат со "#")
// Излез: "<број_цифри>:<сортирани_цифри>" за секоја линија
//
// Пример:
//   Влез:
//     a3b1c2
//     hello9world5
//     #
//   Излез:
//     3:123
//     2:59

#include <iostream>
#include <cctype>
using namespace std;

void bubble_sort(int a[], int n) {
	for (int i = 0; i < n - 1; i++) {
		for (int j = 0; j < n - 1 - i; j++) {
			if (a[j] > a[j + 1]) {
				int tmp = a[j];
				a[j] = a[j + 1];
				a[j + 1] = tmp;
			}
		}
	}
}

int main() {
	char str[100];

	while (cin.getline(str, 100)) {
		if (str[0] == '#') {
			break;
		}

		// 1. extract numbers from string
		int index = 0;
		int numbers[100];

		for (int i = 0; str[i] != '\0'; i++) {
			if (isdigit(str[i])) {
				numbers[index++] = str[i] - '0';
			}
		}

		// 2. sort the numbers in ascending order using bubble sort
		bubble_sort(numbers, index);

		// 3. print count : sorted numbers (no space)
		cout << index << ":";
		for (int i = 0; i < index; i++) {
			cout << numbers[i];
		}
		cout << endl;
	}

	return 0;
}
