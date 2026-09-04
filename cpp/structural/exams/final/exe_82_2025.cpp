// ──────────────────────────────────────────────────────────
// ЗАДАЧА 31  (zad31.cpp)
// ──────────────────────────────────────────────────────────
// Се чита M (број на тест-случаи).
// За секој тест-случај се чита N, па низа од N цели броеви.
// Операцијата function(a, n) ја поместува низата за a[0] позиции:
//   - Ако a[0] > 0: секој елемент a[i] оди на позиција i+a[0]
//     (елементи надвор od границата се губат, останатото е 0)
//   - Ако a[0] < 0: секој a[i] оди на i+a[0]
//     (елементи пред 0 се губат)
//   - Ако a[0] == 0: низата останува иста
//
// За секоја низа да се испечати резултатот (одделен со празни места).
// Потоа да се испечати колку низи ЦЕЛОСНО станале нули.
//
// Пример:
//   Влез: 2
//         3  2 3 4
//         3  0 1 2
//   Излез:
//     0 0 2
//     0 1 2
//     0
#include <iostream>
#include <cmath> // За abs()

using namespace std;

int main() {
	int M;
	if (!(cin >> M)) return 0;

	int fully_zero_arrays = 0;

	while (M > 0) {
		int N;
		cin >> N;

		int a[100];
		for (int i = 0; i < N; i++) {
			cin >> a[i];
		}

		int shift = a[0];
		int temp[100] = {0};

		for (int i = 0; i < N; i++) {
			int new_pos = i + shift;
			if (new_pos >= 0 && new_pos < N) {
				temp[new_pos] = a[i];
			}
		}

		bool is_all_zero = true;
		for (int i = 0; i < N; i++) {
			a[i] = temp[i];
			cout << a[i] << " ";

			if (a[i] != 0) {
				is_all_zero = false;
			}
		}
		cout << endl;

		if (is_all_zero) {
			fully_zero_arrays++;
		}

		M--;
	}

	cout << fully_zero_arrays << endl;

	return 0;
}
