// ──────────────────────────────────────────────────────────
// ЗАДАЧА 4  (zad4.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат N цели броеви.
// Да се најде најмалиот елемент кој се pojавува парен број пати во низата.
//
// Ако не постои таков елемент, се печати:
//   "Nitu eden element ne se pojavuva paren broj pati!"
//
// Инаку се печати:
//   "Najmaliot element koj se pojavuva paren broj pati e <X>"
//
// Влез:  N, па N цели броеви
// Излез: пораката погоре
//
// Пример:
//   Влез : 6
//          3 1 2 3 2 1
//   Излез: Najmaliot element koj se pojavuva paren broj pati e 1
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[10];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	// Solution
	int frequency[10];
	for (int i = 0; i < n; i++) {
		frequency[a[i]]++;
	}

	int min = 10;
	for (int i = 0; i < n; i++) {
		if (frequency[a[i]] % 2 == 0) {
			if (a[i] < min) {
				min = a[i];
			}
		}
	}

	if (min == -1) {
		cout << "Nitu eden element ne se pojavuva paren broj pati!";
	} else {
		cout << "Najmaliot element koj se pojavuva paren broj pati e " << min;
	}

	return 0;
}
