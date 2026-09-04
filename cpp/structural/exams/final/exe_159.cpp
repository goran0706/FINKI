// Write a program that reads lines no longer than 80 characters from SI.
// Each line consists of digits and letters.
//
// The program should print on SO each line transformed in such way that the letters will be concatenated next to each other,
// followed by the sum of all numbers that appear in the row.
// The numbers can be with more than one digit!
// If there are no numbers, print 0 at the end of the line
//
// Input
// y2d3vbqiiK064waaa
// ksdjdjgdjgHH
//
// Output
// ydvbqiiKwaaa69
// ksdjdjgdjgHH0
//
// For example:
// Input
// 7h3r3545h4d0wJu57B3h1ndM3
// 5hr0ud1n63v3ryBr347h174k3
//
// Result
// hrhdwJuBhndM3623
// hrudnvryBrhk596
#include <iostream>
#include <cctype>

using namespace std;

int main() {
	char str[81];

	while (cin.getline(str, 81)) {
		char tmp[81];
		int write = 0;
		int sum = 0;

		for (int i = 0; str[i] != '\0'; i++) {
			if (isalpha(str[i])) {
				tmp[write++] = str[i];
			} else if (isdigit(str[i])) {
				int current = 0;
				int j;

				for (j = i; isdigit(str[j]); j++) {
					current = current * 10 + (str[j] - '0');
				}

				sum += current;

				i = j - 1;
			}
		}

		tmp[write] = '\0';
		cout << tmp << sum << endl;
	}
	return 0;
}
