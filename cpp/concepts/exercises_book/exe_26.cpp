// 3. Write a program that asks the user to type in numbers. After each entry, the program should report the cumulative sum
// of the entries to date. The program should terminate when the user enters 0.

#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    int number;

    while (cin >> number) {
        if (number == 0) {
            break;
            // return 0;
        }

        sum += number;

        cout << number << endl;
        cout << "Sum: " << sum << endl;
    }

    return 0;
}
