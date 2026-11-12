// Let A = {a1, a2, .. a_n} is an array of integers.
// The size of the array n and the elements of the array are read from SI.
// Write a program that will transform the array so each element of the original array is replaced with the number of
// appearance of the least significant digit (the right most) in the number itself.
//
// Print the result array on the standard output.
//
// Compute the count of given digit in a number with separate recursive function.
//
// Example:
//
// Input:
// 5
// 1 11 1121 111222112 22222
// Output:
// 1 2 3 4 5
//
// For example:
// Input
// 3
// 18181818 900003 505
//
// Result
// 4 1 2
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	for (int i = 0; i < n; i++) {
		int num = a[i];
		int lsd = num % 10;
		int count = 0;

		while (num > 0) {
			if (num % 10 == lsd) {
				count++;
			}
			num /= 10;
		}

		a[i] = count;
	}

	for (int i = 0; i < n; i++) {
		cout << a[i] << " ";
	}
}
