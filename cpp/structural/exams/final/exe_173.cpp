// Write a program that will read a string (not longer than 100 characters) containing letters and digits.
// The program should print on the standard output the letters that are between the first and the second digit,
// left-to-right, including the bordering digits themselves.
// If there is only one digit in the string, the program should print all the letters till the end of the string.
// If there is no digits in the string the program should print out the message "No digits".
//
// Example:
// Axvdf7dbb3bdbd88B -> 7dbb3
// Isdv88mvndkv9d -> 88
// vnjis9kjsnvnv -> 9kjsnvnv
// dsfsrtt -> No digits
//
// For example:
// Input
// Isdv88mvndkv9d
//
//
// Result
// 88

#include <iostream>
using namespace std;

int main() {
	char str[101];

	while (cin.getline(str, 101)) {
		if (str[0] == '\0') {
			break;
		}

		int start = -1;
		int end = -1;

		// 1. Find start and end index
		for (int i = 0; str[i] != '\0'; i++) {
			if (isdigit(str[i])) {
				if (start == -1) {
					start = i;
				} else if (end == -1) {
					end = i;
				}
			}
		}

		// 2. Print
		if (start == -1 && end == -1) {
			cout << "No digits" << endl;
		} else if (end == -1) {
			for (int i = start; str[i] != '\0'; i++) {
				cout << str[i];
			}
			cout << endl;
		} else {
			for (int i = start; i <= end; i++) {
				cout << str[i];
			}
			cout << endl;
		}
	}
}
