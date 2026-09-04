// An integer N is read from SI, followed by an array of N one-digit integers.
// Find the numbers A and B that repeat the most times in the array.
// Then print a rectangle with dimension A x B on the standard output in the following format:
//
// **.....*
// **.....*
// **.....*
// **.....*
// **.....*
//
// (A-lines with B-stars, where A is the smaller of the two numbers found).
// In the test cases, there are always exactly two numbers that appear the same most times.
//
// Example:
//
// Input:
// 10
// 2 5 3 7 5 3 3 6 4 5
//
// (3 appears 3 times, 5 appears 3 times, while the others are less frequent)
//
// Output:
//
//     * * * * *
//     * * * * *
//     * * * * *
//
// For example:
// Input
// 11
// 9 8 9 8 1 1 9 8 7 6 5
//
// Result
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
// * * * * * * * * *
#include <iostream>
#include <algorithm>

using namespace std;

int main() {
	int n;
	if (!(cin >> n)) return 0;

	int frequency[10] = {0};

	// Read the array elements and count frequencies
	for (int i = 0; i < n; i++) {
		int num;
		cin >> num;
		frequency[num]++;
	}

	int num_a = -1, num_b = -1;
	int max_a = -1, max_b = -1;

	// Find the two most frequent numbers
	for (int i = 0; i < 10; i++) {
		int count = frequency[i];
		if (count > max_a) {
			// Push current max down to second max
			max_b = max_a;
			num_b = num_a;

			// Set new max
			max_a = count;
			num_a = i;
		} else if (count > max_b) {
			// Set new second max
			max_b = count;
			num_b = i;
		}
	}

	// Ensure num_a is the smaller of the two numbers
	if (num_a > num_b) {
		swap(num_a, num_b);
	}

	// Print the num_a x num_b rectangle
	for (int i = 0; i < num_a; i++) {
		for (int j = 0; j < num_b; j++) {
			cout << "* ";
		}
		cout << endl;
	}

	return 0;
}
