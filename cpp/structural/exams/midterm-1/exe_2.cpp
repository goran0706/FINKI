// Да се напише програма која проверува дали една лозинка е валидна.
//
// Валидна лозинка мора да има:
// - голема буква
// - мала буква
// - бројка
// - специјален карактер
//
// ASCII кодот на првата голема буква A е 65,
// а на последната голема буква Z е 90. ASCII кодовите на
// цифрите од 0 до 9 се движат од 48 до 57.
#include <iostream>
#include <cctype>
using namespace std;

bool is_valid(char str[]) {
	bool has_uppercase = false;
	bool has_lowercase = false;
	bool has_special = false;
	bool has_digit = false;

	for (int i = 0; str[i] != '\0'; i++) {
		char c = str[i];

		if (isalpha(str[i])) {
			if (isupper(str[i])) {
				has_uppercase = true;
			} else {
				has_lowercase = true;
			}
		} else if (!isalnum(c)) {
			has_special = true;
		} else if (isdigit(c)) {
			has_digit = true;
		}

		// if (c >= 'A' && c <= 'Z') {
		// 	has_uppercase = true;
		// } else if (c >= 'a' && c <= 'z') {
		// 	has_lowercase = true;
		// } else if (c >= '0' && c <= '9') {
		// 	has_digit = true;
		// } else {
		// 	has_special = true;
		// }
	}

	return has_uppercase && has_lowercase && has_special && has_digit;
}

int main() {
	char password[100];

	while (cin >> password) {
		if (is_valid(password)) {
			cout << "Valid" << endl;
		} else {
			cout << "Valid" << endl;
		}
	}
}
