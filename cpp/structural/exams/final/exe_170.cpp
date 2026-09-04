// Write a recursive function that will find the number of odd numbers of an array of integers.
// The function accepts as an arguments the array for which the number of odd numbers is required and the total number of elements in the array.
// The function is given with the following prototype:
//
// int Odd (int a [], int n);
//
// Also write the main () function to test the Odd function.
//
// For example:
// Input
// 25
// -1
// -2
// -5
// 5
// 7
// -7
// 5
// 100
// -6
// -2
// 6
// -6
// -2
// -9
// -110
// -24
// -55
// 2
// 4
// 6
// 8
// 10
// 17
// 24
// -25
//
// Result
// 10

#include <iostream>
using namespace std;

int odd(int a[], int n) {
	if (n == 0) return 0;

	if (a[n] % 2 != 0) {
		return 1 + odd(a, n - 1);
	}

	return odd(a, n - 1);
}

int main() {
	int n;
	cin >> n;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	cout << odd(a, n) << endl;
}
