// Да се напише програма што за внесен број на поени од испит
// ќе генерира соодветна оценка според следната табела:
//
// (0, 50) 5
// [50, 60) 6
// [60, 70) 7
// [70, 80) 8
// [80, 90) 9
// [90, 100] 10

#include <iostream>
using namespace std;

int main() {
    int points, grade = 0;
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

    cout << "Grade: " << grade << endl;

    return 0;
}
