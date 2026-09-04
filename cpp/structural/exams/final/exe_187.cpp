// Од тастатура се внесува природен број N. Да се испише следната форма на излез:
//
// 1
// 121
// 11311
// 1114111
// ……
// 11..1N11...11
//
// При печатењето да се искористи рекурзивна функција која ќе печати еден ред од формата: 11..1K11..1.
// Доколку задачата се реши без примена на функција ќе може да се освојат до 40% од поените.
// Доколку функцијата не е (потполно) рекурзивна, може да со освојат до 60% од поените
// ---------------------------------
//
// A natural number N is given as input. The following output format should be printed:
//
// 1
// 121
// 11311
// 1114111
// ……
// 11..1N11...11
//
// When printing, use a recursive function that will print a line of the form: 11..1K11..1.
// If the task is solved without using a function, up to 40% of the points can be earned.
// If the function is not (fully) recursive, up to 60% of the points can be earned.
//
// For example:
// Input
// 6
//
// Result
// 1
// 121
// 11311
// 1114111
// 111151111
// 11111611111

// Input
// 5
//
// Result
// 1
// 121
// 11311
// 1114111
// 111151111
#include <iostream>
using namespace std;

void print_pattern(int n, int i = 1, int current_step = 1) {
	if (i > n) {
		return;
	}

	if (current_step == i) {
		cout << i;
	} else {
		cout << 1;
		print_pattern(n, i, current_step + 1);
		cout << 1;
	}

	if (current_step == 1) {
		cout << endl;
		print_pattern(n, i + 1, 1);
	}
}

int main() {
	int n;
	cin >> n;
	print_pattern(n);
	return 0;
}