// Write a program that will print the contents read from SI coded.
// The coding is done letter by letter, so that each letter (only letters, not digits, dots, ...)
// is replaced with the letter 3 places after in the alphabet. In case of the letters at the end of the alphabet,
// the counting continues cyclic from the beginning of the alphabet. In the final coded text all letters are lowercase.
// Example letter a is coded to d, H is coded to k, p is coded to s, x is coded to a, etc.
//
// For example:
// Input
// Momentalno go testiram resenieto na mojata treta zadaca!
//
// Result
// prphqwdoqr jr whvwludp uhvhqlhwr qd prmdwd wuhwd cdgdfd!
#include <iostream>
using namespace std;

void encrypt(char str[], int pos) {
	pos = pos % 26;
	for (int i = 0; str[i] != '0'; i++) {
		char c = str[i];
		if (isalpha(c)) {
			if (isupper(c)) {
				str[i] = (c - 'A' + pos) % 26 + 'A';
			} else {
				str[i] = (c - 'a' + pos) % 26 + 'a';
			}
		}
	}
}

int main() {
	char str[100];

	while (cin.getline(str, 100)) {
		if (str[0] == '\0') {
			break;
		}
		encrypt(str, 3);
		cout << str << endl;
	}
}
