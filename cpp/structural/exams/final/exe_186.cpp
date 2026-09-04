// На влез е даден природен број  N (N<=100) и во следните N редови е даден по еден стринг со должина помала од 80 знаци.
// Вашата програма треба на излез да го отпечати најдолгиот стринг кој е палиндром (стринг кој потполно исто се чита и од лево на десно и од десно на лево).
// Доколку има повеќе такви стрингови, да се отпечати тој што е лексикографски најмал (според редоследот од функцијата  strcmp()).
// Ако нема ниту еден таков стринг, на екран се печати NEMA.
//
// ---
//
// An integer N is given as input (N <= 100), followed by N lines, each containing one string of length less than 80 characters.
// Your program should output the longest string that is a palindrome (a string that reads the same forwards and backwards).
// If there are multiple such strings, you should print the lexicographically smallest one (according to the order given by the strcmp() function).
// If there is no palindrome at all, print NEMA on the screen.

// For example:
// Input
// 6
// asasa
// a&b&a&b&a
// awawawawawaw
// Xyz
// c&b&a&b&c
// PotoP
//
// Result
// a&b&a&b&a

// Input
// 3
// asdr
// u6253u3
// lakdsadalkfhldakf
//
// Result
// NEMA
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
	int max_length = -1;

	for (int i = 0; i < n; i++) {
		cin.getline(str, 80);
		int current_length = strlen(str);

		if (is_palindrome(str, current_length)) {
			if (current_length > max_length) {
				max_length = current_length;
				strcpy(tmp, str);
			} else if (current_length == max_length) {
				if (strcmp(tmp, str) > 0) {
					strcpy(tmp, str);
				}
			}
		}
	}

	if (max_length == -1) {
		cout << "NEMA" << endl;
	} else {
		cout << tmp << endl;
	}

	return 0;
}
