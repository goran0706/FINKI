// ──────────────────────────────────────────────────────────
// ЗАДАЧА 26  (zad26.cpp)
// ──────────────────────────────────────────────────────────
// Идентична логика со Задача 4 (со посебна функција):
// Се читаат N цели броеви.
// Да се најде најмалиот елемент кој се pojавува парен број пати.
// Ако не постои:
//   "Nitu eden element ne se pojavuva paren broj pati!"
// Инаку:
//   "Najmaliot element koj se pojavuva paren broj pati e <X>"
//
// Влез:  N, па N цели броеви
// Излез: пораката

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100];
	int frequency[10];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
		frequency[a[i]]++;
	}

	int min = a[0];
	int index = -1;

	for (int i = 0; i < n; i++) {
		if (a[i] < min && frequency[a[i]] % 2 == 0) {
			min = a[i];
			index = i;
		}
	}

	if (index == -1) {
		cout << "Nitu eden element ne se pojavuva paren broj pati!" << endl;
	} else {
		cout << "Najmaliot element koj se pojavuva paren broj pati e " << a[index] << endl;
	}

	return 0;
}
