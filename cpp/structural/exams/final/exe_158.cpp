// Write a program that will read from SI words (each in a separate row) no longer than 30 letters.
// Find all the words that define a palindrome only with the vowels they contain (after making the opposite word of the given one,
// the vowels have not changed their indexes within the word).
// Print these words on a standard output.
// The appearance of uppercase and lowercase letters should be ignored.
//
// Example:
//
// Hellen
// input
// werAnifameb
//
// output:
// Hellen
// werAnifameb
//
// For example:
// Input
// KalAbaLAm
// BananaS
// WooooSH
// ANMA

// Result
// KalAbaLAm
// BananaS
// ANMA
#include <cstring>
#include <iostream>
using namespace std;

bool is_vowel(char c) {
	c = tolower(c);
	return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

bool is_palindrome(const char *str) {
	int n = strlen(str);

	for (int i = 0; i <= n / 2; i++) {
		if (str[i] != str[n - 1 - i]) {
			return false;
		}
	}

	return true;
}

int main() {
	char word[31];

	while (cin.getline(word, 31)) {
		if (word[0] == '\0') {
			break;
		}

		char tmp[31];
		int write = 0;

		for (int i = 0; word[i] != '\0'; i++) {
			if (is_vowel(word[i])) {
				tmp[write++] = word[i];
			}
		}

		tmp[write] = '\0';

		if (is_palindrome(tmp)) {
			cout << word << endl;
		}
	}
}
