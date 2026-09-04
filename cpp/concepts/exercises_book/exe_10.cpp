// 3. Write a program that asks the user to enter a latitude in degrees, minutes, and seconds and that then displays
// the latitude in decimal format. There are 60 seconds of arc to a minute and 60 minutes of arc to a degree;
// represent these values with symbolic constants. You should use a separate variable for each input value.
// A sample run should look like this:
// ```
// Enter a latitude in degrees, minutes, and seconds:
// First, enter the degrees: 37
// Next, enter the minutes of arc: 51
// Finally, enter the seconds of arc: 19
// 37 degrees, 51 minutes, 19 seconds = 37.8553 degrees
// ```

#include <iostream>
using namespace std;

int main() {
    int degrees = 0;
    int minutes = 0;
    int seconds = 0;

    const int arc_seconds_per_minute = 60;
    const int arc_minutes_per_degree = 60;

    cout << "Enter a latitude in degrees, minutes, and seconds:\n";
    cout << "First, enter the degrees: ";
    cin >> degrees;

    cout << "Next, enter the minutes of arc: ";
    cin >> minutes;

    cout << "Finally, enter the seconds of arc: ";
    cin >> seconds;

    double decimal = degrees + minutes / (double) arc_minutes_per_degree + seconds / (double) (
                         arc_seconds_per_minute * arc_minutes_per_degree);

    cout << degrees << " degrees, " << minutes << " minutes, " << seconds << " seconds = " << decimal << " degrees\n";

    return 0;
}
