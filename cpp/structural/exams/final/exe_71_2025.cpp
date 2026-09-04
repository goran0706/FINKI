// ──────────────────────────────────────────────────────────
// ЗАДАЧА 20  (zad20.cpp)
// ──────────────────────────────────────────────────────────
// Се читаат два знаци Z1 и Z2, па линии текст до "#".
// За секоја линија, да се испечати подниза помеѓу ПОСЛЕДНОТО појавување на Z1 и ПОСЛЕДНОТО појавување на Z2
// (не вклучувајќи ги самите Z1 и Z2).
//
// Влез:
//   Прв ред : Z1 Z2
//   Следните редови : линии текст (завршуваат со "#")
//
// Излез: извлечените поднизи, по еден на ред
//
// Пример:
//   Влез : ( )
//          hello(world)end
//          #
//   Излез: world
#include <cstring>
#include <iostream>
using namespace std;

int main() {
	char z1, z2;
	cin >> z1 >> z2;
	cin.ignore();

	char str[100];

	while (cin.getline(str, 100)) {
		if (str[0] == '#') {
			break;
		}

		if (z1 == z2) {
			break;
		}

		int n = strlen(str);
		int start = -1;
		int end = -1;

		for (int i = n - 1; i > 0; i--) {
			if (start == -1 && str[i] == z1) {
				start = i + 1;
			}

			if (end == -1 && str[i] == z2) {
				end = i;
			}
		}

		for (int i = start; i < end; i++) {
			cout << str[i];
		}
		cout << endl;
	}

	return 0;
}
