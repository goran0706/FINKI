// TASK 11:
// За дадени освоени поени пишете ја оценката која го следи студентот според дадените табели.
// 0-50 = 5, 51-60 = 6, 61-70 = 7, 71-80 = 8, 81-90 = 9, 91-100 = 10
//
// Покрај оценките да се испечатат и знаците + и – во зависност од вредноста на последната цифра на поените:
// 1 - 3 = "-", 4 - 7 = " ", 8-0 = "+"

#include <iostream>
using namespace std;

int main() {
	int points, grade;
	cin >> points;

	if (points > 90) {
		grade = 10;
	} else if (points > 80) {
		grade = 9;
	} else if (points > 70) {
		grade = 8;
	} else if (points > 60) {
		grade = 7;
	} else if (points > 50) {
		grade = 6;
	} else {
		grade = 5;
	}

	char sign = ' ';
	int digit = points % 10;

	if (digit >= 1 && digit <= 3) {
		sign = '-';
	} else if (digit >= 8 && digit <= 9 || digit == 0) {
		sign = '+';
	}

	cout << grade << sign << endl;
}
