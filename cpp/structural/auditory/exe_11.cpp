// Да се напише програма каде од тастатура ќе се внесе датумот на раѓање во формат (ddmmgggg).
// Програмата на компјутерскиот екран ќе го испечати денот и месецот на раѓање.
// Пример: Ако се внесе следниот број: 18091992, програмата ќе испечати: 18.9
// ПОМОШ: Искористете целобројно делење и остаток од делење.

#include <iostream>
using namespace std;

int main() {
    int dateOfBirth;
    cin >> dateOfBirth;

    const int year = dateOfBirth % 1000;
    const int month = dateOfBirth / 10000 % 100;
    const int day = dateOfBirth / 1000000 % 100;

    cout << day << "." << month << endl;

    // dateOfBirth /= 10000;
    // const int month = dateOfBirth % 100;

    // dateOfBirth /= 100;
    // const int day = dateOfBirth % 100;

    // cout << day << "." << month << endl;

    return 0;
}
