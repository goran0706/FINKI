// 2. Write a program that reads up to 10 donation values into an array of double. (Or, if you prefer, use an array
// template object.) The program should terminate input on non-numeric input. It should report the average of the
// numbers and also report how many numbers in the array are larger than the average

#include <iostream>
using namespace std;

int main() {
    const int ArrSize = 10;

    double donations[ArrSize];
    double sum = 0;
    int count = 0;

    // read input
    while (count < ArrSize && cin >> donations[count]) {
        sum += donations[count];
        count++;
    }

    if (count == 0) {
        cout << "No valid donations entered.\n";
        return 0;
    }

    double average = sum / count;

    int larger = 0;
    for (int i = 0; i < count; i++) {
        if (donations[i] > average)
            larger++;
    }

    cout << "Average: " << average << endl;
    cout << "Larger count: " << larger << endl;

    return 0;
}
