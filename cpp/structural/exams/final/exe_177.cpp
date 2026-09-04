// From SI read lines of text, none of which is longer than 80 characters.
// Write e program that will transform the input and print it out on the standard output.
// The output should contain only letters (all other characters are discarded), and each word should be printed in a separate line.
//
// Example:
//
// Input file:
// Vo5 ovaa 6d6ato$$tek!a ke
// ostanat09856 4453 sa5m2o
// bu!!4kv(((((i
//
// Output:
// Vo
// ovaa
// datoteka
// ke
// ostanat
// samo
// bukvi
//
// For example:
// Input
// Test two words
//
// Result
// Test
// two
// words

#include <iostream>
#include <cctype>
#include <cstring>

using namespace std;

int main() {
	char str[81];

	while (cin.getline(str, 81)) {
		char word[81];
		int write = 0;
		int n = strlen(str);

		for (int i = 0; i <= n; i++) {
			if (isspace(str[i]) || str[i] == '\0') {
				if (write > 0) {
					word[write] = '\0';
					cout << word << endl;
					write = 0;
				}
			} else if (isalpha(str[i])) {
				word[write++] = str[i];
			}
		}
	}

	return 0;
}
