// An array of integers is to be read from SI. First the number N (N<=100) is entered followed by N integers.
// Write a program that will transform the array in the following way:
// starting at the beginning of the array, for each element that is equal to the next element in the array,
// double the value of the first one and overwrite the second one with 0.
//
// After that, rearrange the array so that all the zeroes will be moved at the end of the array, keeping the order of the other elements.
// Print all the elements of the array on the SO in a single line, separated by space.
//
// Write separate functions for transforming the array and for reordering the elements.
//
// Example:
// 6
// 2 2 0 4 8 8
//
// (Intermediate: 4, 0, 0, 4, 16, 0)
//
// Output:
// 4 4 16 0 0 0
//
// For example:
// Input
// 7
// 0 0 0 0 0 0 0
//
// Result
// 0 0 0 0 0 0 0

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	// 1. Transform
	for (int i = 0; i < n - 1; i++) {
		if (a[i] == a[i + 1]) {
			a[i] = a[i] * 2;
			a[i + 1] = 0;
		}
	}

	// 2. Reorder
	int b[100] = {0};
	int write = 0;

	for (int i = 0; i < n - 1; i++) {
		if (a[i] > 0) {
			b[write++] = a[i];
		}
	}

	// 3. Print
	for (int i = 0; i < n; i++) {
		cout << b[i] << " ";
	}
}
