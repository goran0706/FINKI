// Дадена е низа со броеви (позитивни и негативни).
// Ваша задача е да ја трансформирата така што позитивните броеви од низата ќе бидат од една страна, а негативните од друга.
//
// Влез:
// 7
// -2 5 0 1 5 -7 -4
//
// Излез:
// 5 0 1 5 -2 -7 -4
// */
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	// Solution:
	int tmp[n];
	int write_index = 0;

	// 1. Positive numbers
	for (int i = 0; i < n; i++) {
		if (a[i] >= 0) {
			tmp[write_index++] = a[i];
		}
	}

	// 2. Negative numbers
	for (int i = 0; i < n; i++) {
		if (a[i] < 0) {
			tmp[write_index++] = a[i];
		}
	}

	// 3. Print transformed
	for (int i = 0; i < n; i++) {
		cout << tmp[i] << " ";
	}
}
