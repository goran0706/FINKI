// Од стандарден влез се внесуваат броеви n. Да се пресмета сумата на внесените броеви, така што,
// сумата ќе се инкрементира за збирот на цифрите на секој број.
#include <iostream>
using namespace std;

int main() {
	int n;

	int sum = 0;

	while (cin >> n) {
		while (n > 0) {
			sum += n % 10;
			n /= 10;
		}
	}

	cout << sum << endl;
}
