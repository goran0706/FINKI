// int sumaParni(int n)
// da se vrati prva golema bukva od string
#include <iostream>
using namespace std;

int sumaParni(int n) {
	int sum = 0;

	while (n > 0) {
		int digit = n % 10;
		if (digit % 2 == 0) {
			sum += digit;
		}
		n /= 10;
	}

	return sum;
}

int main() {
	int n;
	cin >> n;
	cout << sumaParni(n) << endl;
}
