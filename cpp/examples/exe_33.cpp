// 10. Write a program using nested loops that asks the user to enter a value for the number of rows to display.
// It should then display that many rows of asterisks, with one asterisk in the first row, two in the second row, and so on.
// For each row, the asterisks are preceded by the number of periods needed to make all the rows display a total number of
// characters equal to the number of rows.
//
// A sample run would look like this:
// Enter number of rows: 5
// ```cpp
// ....*
// ...**
// ..***
// .****
// *****
// ```

#include <iostream>
using namespace std;

int main() {
    int rows;
    cout << "Enter number of rows: ";
    cin >> rows;

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < rows; col++) {
            cout << (col < rows - row - 1 ? '.' : '*');
        }
        cout << endl;
    }

    return 0;
}
