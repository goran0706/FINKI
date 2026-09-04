// ──────────────────────────────────────────────────────────
// ЗАДАЧА 33  (zad33.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат групи: прво N, па N цели броеви.
// Ако N == 0, се завршува.
// За секоја група да се најде бројот со НАЈГОЛЕМА најзначајна цифра (MSD – most significant digit).
// Ако два броја имаат исти MSD, се зема оној прочитан прв.
// Да се испечати тој број.
//
// Пример:
//   Влез: 3
//         512 923 317
//         0
//   Излез: 923

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	if (n == 0) {
		return 0;
	}

	int a[100];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	int max = 0;
	int max_number = a[0];

	for (int i = 0; i < n; i++) {
		int tmp = a[i];
		int msd = 0;

		while (tmp > 0) {
			msd = tmp % 10;
			tmp /= 10;
		}

		if (msd > max) {
			max = msd;
			max_number = a[i];
		}
	}

	cout << max_number << endl;

	return 0;
}
