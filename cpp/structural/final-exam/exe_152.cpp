// N positive integers are entered from the standard input and stored in an array a (N <100)**.
// Also, a single-digit integer **k** is entered.
// Write a function that will find the maximum of the abbreviated numbers of the elements in the array **a** and
// provide a call to that function in the main () function.
// A given element of the array is abbreviated as follows: all digits smaller than or equal to **k are deleted from the number.
//
// For example: If k = 3 and a[0] = 12345, then abbreviated a[0] becomes 45, if a[1] = 458763,
// a[1] becomes 45876, and a[2] = 112 is shortened to a[2] = 0.
// The maximum abbreviated number is 45876.
//
// For example:
// Input
// 3
// 12365
// 98765
// 654
// 2
//
// Result
// 98765
#include <iostream>
using namespace std;

int abbr(int n, int k) {
	int result = 0;
	int multiplier = 1;

	while (n > 0) {
		int digit = n % 10;
		if (digit > k) {
			result += digit * multiplier;
			multiplier *= 10;
		}
		n /= 10;
	}

	return result;
}

int main() {
	int n;
	cin >> n;

	int a[100];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	int k;
	cin >> k;

	int max = a[0];
	for (int i = 0; i < n; i++) {
		int abbr_number = abbr(a[i], k);
		if (abbr_number > max) {
			max = abbr_number;
		}
	}

	cout << max << endl;
}
