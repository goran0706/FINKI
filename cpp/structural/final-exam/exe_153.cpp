// N positive integers are entered from the standard input and are stored in an array (N <100).
// All elements that meet the next criteria should be presented on the standard output in the same order that they have appeared on the standard input.
// The criteria is following: the most important digit (the digit on the first place) is odd and the least important digit is even.
// If, no such number was entered, you should print out "No such elements!" message.
//
// The implementation of checking the criteria should be performed in a separate function (recursive function for additional 5 points).
//
// For example:
// Input
// 10
// 12345
// 2345
// 345678
// 2912301
// 3212342
// 9129321
// 77777
// 213312
// 32322
// 313138
//
// Result
// 345678
// 3212342
// 32322
// 313138
#include <iostream>
using namespace std;

int firstDigit(int n) {
	if (n < 10) return n;
	return firstDigit(n / 10);
}

bool has_odd_even(int n) {
	int lsd = n % 10;
	int msd = firstDigit(n);
	return (msd % 2 == 1) && (lsd % 2 == 0);
}

int main() {
	int n;
	cin >> n;

	int a[100];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	bool found = false;

	for (int i = 0; i < n; i++) {
		if (has_odd_even(a[i])) {
			cout << a[i] << endl;
			found = true;
		}
	}

	if (!found) {
		cout << "No such elements!";
	}

	return 0;
}
