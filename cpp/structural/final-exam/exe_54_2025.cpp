// vnesuvas n pa n-nizi od karakteri, od sekoja niza da se isfrlat samoglaskite i taka da se ispecati

#include <iostream>
#include <cctype>
using namespace std;

bool is_vowel(const char c) {
	const char lower_c = tolower(c);
	return lower_c == 'a' || lower_c == 'e' || lower_c == 'i' || lower_c == 'o' || lower_c == 'u';
}

int main() {
	int n;
	cin >> n;
	cin.ignore();

	char str[100];

	// Solution 1: Skip vowels and print the characters immediately
	for (int i = 0; i < n; i++) {
		cin.getline(str, 100);

		for (int j = 0; str[j] != '\0'; j++) {
			if (is_vowel(str[j])) {
				continue;
			}
			cout << str[j];
		}
		cout << endl;
	}

	// Solution 2: use a matrix to store transformed character arrays
	char storage[n][100];
	char tmp[100];

	for (int i = 0; i < n; i++) {
		cin.getline(tmp, 100);

		int index = 0;

		for (int j = 0; tmp[j] != '\0'; j++) {
			if (is_vowel(tmp[j])) {
				continue;
			}
			storage[i][index++] = tmp[j];
		}
		storage[i][index] = '\0';
	}

	for (int i = 0; i < n; i++) {
		cout << storage[i] << endl;
	}

	return 0;
}
