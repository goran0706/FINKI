/*
    1.1 Date

    Да се напише програма која ќе споредува два датуми (ден, месец, година)
    и ќе ја пресмета разликата во денови од едниот до другиот датум.

    Пресметките да се реализираат во посебни функции.

    За датумот да се дефинира посебна структура date.
*/
#include <iostream>
#include <cmath>
using namespace std;

struct Date {
    int day = 1;
    int month = 1;
    int year = 2000;

    static bool is_leap(int y) {
        return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);
    }

    static int days_in_month(int m, int y) {
        int days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

        if (m == 2 && is_leap(y)) {
            return 29;
        }
        return days[m - 1];
    }

    [[nodiscard]] long int convert_to_days() const {
        long int total_days = day;

        for (int m = 1; m < month; m++) {
            total_days += days_in_month(m, year);
        }

        for (int y = 1; y < year; y++) {
            if (is_leap(y)) {
                total_days += 366;
            } else {
                total_days += 365;
            }
        }

        return total_days;
    }

    [[nodiscard]] int days_difference(const Date &other) const {
        long int days1 = this->convert_to_days(); // или само convert_to_days()
        long int days2 = other.convert_to_days();

        return abs(days1 - days2);
    }
};

Date read_date() {
    Date d;
    cout << "Внеси ден, месец и година: ";
    cin >> d.day >> d.month >> d.year;
    return d;
}

int main() {
    Date d1 = read_date();
    Date d2 = read_date();

    cout << "Разлика во денови: " << d1.days_difference(d2) << endl;

    return 0;
}
