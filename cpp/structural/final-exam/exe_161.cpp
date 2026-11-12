// Words (no longer than 20 letters and each in a new line) are read from SI.
// Write a program that will print the word that has the biggest number of different letters.
// Words that have less than four letters are not taken into account during the check.
// Do not make a difference between upper and lower case letters.
// If there are more words that meet the criteria, the last one is printed.
//
// For example:
// Input
//
// To
// those
// whom
// Ive
// fought
// with
// and
// to
// those
// I
// dont
// know
// your
// name
// we
// fought
// by
// one
// another
// You
// did
// not
// die
// in
// vain
#include <cstring>
#include <iostream>
#include <cctype>

using namespace std;

int main() {
	char word[21];
	char max_word[21] = "";
	int max_count = -1;

	while (cin.getline(word, 21)) {
		if (word[0] == '\0') {
			break;
		}

		int len = strlen(word);

		if (len < 4) {
			continue;
		}

		int seen[26] = {0};
		int seen_count = 0;

		for (int i = 0; word[i] != '\0'; i++) {
			if (isalpha(word[i])) {
				int index = tolower(word[i]) - 'a';
				if (seen[index] == 0) {
					seen[index] = 1;
					seen_count++;
				}
			}
		}

		if (seen_count < 4) {
			continue;
		}

		if (seen_count >= max_count) {
			max_count = seen_count;
			strcpy(max_word, word);
		}
	}

	if (max_count != -1) {
		cout << max_word << endl;
	}

	return 0;
}
