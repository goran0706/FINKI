// 10. Write a program that requests the user to enter three times for the 40-yd dash (or 40-meter, if you prefer)
// and then displays the times and the average. Use an array object to hold the data.
// (Use a built-in array if array is not available.)

#include <array>
#include <iostream>
using namespace std;

int main() {
    const int arraySize = 3;
    array<double, arraySize> times = {};
    double sum = 0;

    for (int i = 0; i < arraySize; i++) {
        cout << "Enter 40-meter time: ";
        cin >> times[i];
        sum += times[i];
    }

    double average = sum / arraySize;

    for (int i = 0; i < arraySize; i++)
        cout << "Time " << i + 1 << ": " << times[i] << endl;
    cout << "Average: " << average << endl;

    return 0;
}
