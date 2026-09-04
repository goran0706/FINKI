// 5. You sell the book C++ for Fools. Write a program that has you enter a year’s worth of monthly sales (in terms of
// number of books, not of money). The program should use a loop to prompt you by month, using an array of char * (or an
// array of string objects, if you prefer) initialized to the month strings and storing the input data in an array of
// int. Then, the program should find the sum of the array contents and report the total sales for the year.

#include <string>
#include <iostream>
using namespace std;

const int Cols = 12;

int main() {
    string months[Cols] = {
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Noe",
        "Dec"
    };

    int sales[Cols];
    int sum = 0;

    for (int i = 0; i < Cols; i++) {
        cout << "Enter book sales for " << months[i] << ": ";
        cin >> sales[i];
        sum += sales[i];
    }

    cout << "Total sales for the year: " << sum << endl;

    return 0;
}
