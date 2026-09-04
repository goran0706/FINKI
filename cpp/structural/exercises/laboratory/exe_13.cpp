// TASK 13:
// Да се напише програма каде од тастатура се внесува еден седумцифрен број.
//
// Програмата печати DA доколку бројот е специјален, а NE во спротивно.
// Еден број е специјален доколку за него важи дека е:
// - делив со својата прва цифра и не е делив со збирот на последните две или
// - доколку не е делив со својата втора цифра и не е делив со збирот на последните две.
// Да се внимава на делење со 0, т.е. да се испечати порака "Nevaliden broj" во таков случај.

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int first = n % 10000000;
	int second = n % 1000000;
	int tens = n / 10 % 10;
	int ones = n % 10;
	int sum_last_two = tens + ones;

	if (sum_last_two == 0) {
		cout << "Invalid number" << endl;
	} else if (
		n % first == 0 && n % sum_last_two != 0 ||
		n % second != 0 && n % sum_last_two != 0
	) {
		cout << "YES" << endl;
	} else {
		cout << "NO" << endl;
	}
}
