/*
Да се напише програма која за внесени N цели броеви ќе ја одреди и отпечати најчестата последна цифра.
При изедначен број појавувања, се печати помалата цифра.

Влез:
5
123 456 789 223 111

Излез:
3

*/

#include <iostream>
using namespace std;

int main() {
	int n, num;
	cin >> n;

	int frequency[10] = {0};

	for (int i = 0; i < n; i++) {
		cin >> num;
		frequency[num % 10]++;
	}

	int maxCount = frequency[0];
	int max = 0;

	for (int i = 0; i < n; i++) {
		cout << i << ":" << frequency[i] << endl;

		if (frequency[i] > maxCount) {
			maxCount = frequency[i];
			max = i;
		}
	}

	cout << max << endl;
}
