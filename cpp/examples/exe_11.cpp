// 4. Write a program that asks the user to enter the number of seconds as an integer value (use type long, or, if available, long long)
// and that then displays the equivalent time in days, hours, minutes, and seconds.
//
// Use symbolic constants to represent the number of hours in the day, the number of minutes in an hour, and the number
// of seconds in a minute.
//
// The output should look like this:
// ```
// Enter the number of seconds: 31600000
// 31600000 seconds = 365 days, 17 hours, 46 minutes, 40 seconds
// ```

#include <iostream>
#include <limits.h>

int main() {
    using namespace std;

    long long number_seconds;

    cout << "Enter the number of seconds: ";
    cin >> number_seconds;

    const int hours_per_day = 24;
    const int minutes_per_hour = 60;
    const int seconds_per_minute = 60;

    long long input = number_seconds;

    int days = number_seconds / (seconds_per_minute * minutes_per_hour * hours_per_day);
    number_seconds %= (seconds_per_minute * minutes_per_hour * hours_per_day);

    int hours = number_seconds / (seconds_per_minute * minutes_per_hour);
    number_seconds %= (seconds_per_minute * minutes_per_hour);

    int minutes = number_seconds / seconds_per_minute;
    number_seconds %= seconds_per_minute;

    int seconds = number_seconds;

    cout << input << " seconds = " << days << " days, " << hours << " hours, "
            << minutes << " minutes, " << seconds << " seconds\n";

    return 0;
}
