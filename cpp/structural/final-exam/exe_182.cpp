// Од тастатура се внесува природен број N.
// Да се испише следната форма на излез:
// 1234...N...4321
// ………..
// 123454321
// 1234321
// 12321
// 121
// 1
//
// При печатењето да се искористи рекурзивна функција која ќе печати еден ред од формата: 123...K...321.
//
// Доколку задачата се реши без примена на функција ќе може да се освојат до 40% од поените.
// Доколку функцијата не е (потполно) рекурзивна, може да со освојат до 60% од поените.
// ---------------------------------
//
// A natural number N is given as input. The following output format should be printed:
//
// 1234...N...4321
// ………..
// 123454321
// 1234321
// 12321
// 121
// 1
//
// When printing, use a recursive function that will print a line of the form: 123...K...321.
//
// If the task is solved without using a function, up to 40% of the points can be earned.
// If the function is not (fully) recursive, up to 60% of the points can be earned.
//
// For example:

// Input
// 6
//
// Result
// 12345654321
// 123454321
// 1234321
// 12321
// 121
// 1

// Input
// 5
//
// Result
// 123454321
// 1234321
// 12321
// 121
// 1
#include <iostream>
using namespace std;

void print_pattern(int n, int i = 1) {
	if (n < 1) {
		return;
	}

	cout << i;

	if (i < n) {
		print_pattern(n, i + 1);
		cout << i;
	}

	if (i == 1) {
		cout << endl;
		print_pattern(n - 1, 1);
	}
}

int main() {
	int n;
	cin >> n;
	print_pattern(n);
}
