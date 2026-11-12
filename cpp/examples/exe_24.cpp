// 1. Write a program that requests the user to enter two integers. The program should then calculate and report the sum of
// all the integers between and including the two integers. At this point, assume that the smaller integer is entered
// first. For example, if the user enters 2 and 9, the program should report that the sum of all the integers from 2
// through 9 is 44.

#include <iostream>

int main() {
    using namespace std;

    int start = 0;
    int end = 0;

    cout << "Enter range start point: ";
    cin >> start;

    cout << "Enter range end point: ";
    cin >> end;

    int sum = 0;

    for (int num = start; num <= end; num++) {
        sum += num;
    }

    // int temp = start;
    // while (temp <= end) {
    //     sum += temp;
    //     temp++;
    // }

    cout << "The sum of all the integers from " << start << " through " << end << " is " << sum << "." << endl;
}
