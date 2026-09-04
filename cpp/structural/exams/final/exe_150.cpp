// Read a an array of N integers from standard input (first read the number N than the elements).
// Than call a recursive function on the array that will change on the following way:
//
// a0=aN−1=max(a0,aN−1)
// a1=aN−2=max(a1,aN−2)
//
// ...
//
// where max is a function that returns the maximum of the two numbers.
// The function should return the number of switched elements.
// Then print that number and the changed array.
//
// For example:
// Input
// 5
// 4 5 6 7 8
//
// Result
// 2
// 8 7 6 7 8
#include <iostream>
using namespace std;

int max(const int a, const int b) {
	return a > b ? a : b;
}

void swap_elements(int a[], int n, int idx = 0) {
	if (n == 0) return;

	a[idx] = max(a[idx], a[n - 1]);

	swap_elements(a, n - 1, idx + 1);
}

int main() {
	int n;
	cin >> n;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	swap_elements(a, n);

	for (int i = 0; i < n; i++) {
		cout << a[i] << " ";
	}
}
