// Да се напише програма што за внесен број на поени од испит ќе генерира соодветна оценка според следната табела:
// Да се промени претходната програма, така што покрај оценките ќе се испечатат и знаците + и –
// во зависност од вредноста на последната цифра на поените:
//
// (0, 50) 5
// [50, 60) 6
// [60, 70) 7
// [70, 80) 8
// [80, 90) 9
// [90, 100) 10
//
// 1 - 3 -
// 4 - 7
// 8 - 0 +

#include <iostream>
using namespace std;

int main() {
    int points, grade;
    cin >> points;

    if (points < 0 || points > 100) {
        cout << "Invalid points" << endl;
        return 0;
    }

    if (points < 50) {
        grade = 5;
    } else if (points < 60) {
        grade = 6;
    } else if (points < 70) {
        grade = 7;
    } else if (points < 80) {
        grade = 8;
    } else if (points < 90) {
        grade = 9;
    } else {
        grade = 10;
    }

    cout << "Grade: " << grade;

    if (points % 10 < 4) {
        cout << '-';
    } else if (points % 10 > 7) {
        cout << '+';
    }

    cout << endl;

    return 0;
}
