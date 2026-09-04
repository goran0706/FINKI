// На влез е даден природен број  N (N<=100) и во следните N редови е даден по еден стринг со должина помала од 80 знаци.
// Вашата програма треба на излез да го отпечати најкраткиот стринг кој не е палиндром (стринг кој потполно исто се чита и од лево на десно и од десно на лево).
// Доколку има повеќе такви стрингови, да се отпечати тој што е лексикографски најголем (според редоследот од функцијата strcmp()).
// Ако нема ниту еден таков стринг, на екран се печати NEMA.
// ---
//
// An integer N is given as input (N <= 100), followed by N lines, each containing one string of length less than 80 characters.
// Your program should output the shortest string that is not a palindrome (a string that does not read the same forwards and backwards).
// If there are multiple such strings, you should print the lexicographically largest one (according to the order given by the strcmp() function).
// If there is no such string, print NEMA on the screen.
//
// For example:
// Input
// 6
// asasa
// a&b&a&b&a
// awawawawawawa
// XyzyX
// c&b&a&b&c
// PotoP
//
// Result
// NEMA
//

// Input
// 4
// asdr
// u6253u3
// bebe
// lakdsadalkfhldakf
//
// Result
// bebe
#include <cstring>
#include <iostream>
using namespace std;

bool is_palindrome(const char *str, int n) {
	for (int i = 0; i < n / 2; i++) {
		if (str[i] != str[n - 1 - i]) {
			return false;
		}
	}
	return true;
}

int main() {
	int n;
	if (!(cin >> n)) return 0;
	cin.ignore();

	char str[80];
	char tmp[80];
	int min_length = 80;

	for (int i = 0; i < n; i++) {
		cin.getline(str, 80);
		int current_length = strlen(str);

		if (!is_palindrome(str, current_length)) {
			if (current_length < min_length) {
				min_length = current_length;
				strcpy(tmp, str);
			} else if (current_length == min_length) {
				if (strcmp(tmp, str) < 0) {
					strcpy(tmp, str);
				}
			}
		}
	}

	if (min_length == -1) {
		cout << "NEMA" << endl;
	} else {
		cout << tmp << endl;
	}

	return 0;
}
