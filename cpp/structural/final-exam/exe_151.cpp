// Write a fully recursive function triangle (n) which given the input argument n, prints a triangle from the numbers from 1 to n.
// Additional functions can be used, but no loops should be used.
//
// Example for n=4.
//
//     1
//     12
//     123
//     1234
//
// For example:
// Input
// 4
//
//
// Result
// 1
// 12
// 123
// 1234
#include <iostream>
using namespace std;

void print(int n) {
	if (n == 0) return;

	print(n - 1);
	cout << n;
}

void triangle(int n) {
	if (n == 0) return;

	triangle(n - 1);
	print(n);
	cout << '\n';
}

int main() {
	int n;
	cin >> n;
	triangle(n);
}
