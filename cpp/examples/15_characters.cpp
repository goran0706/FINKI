#include <iostream>
using namespace std;

int main() {
    char ch = 'A'; // assign ASCII code for A to ch
    int number = ch; // store same code in an int

    // cin & cout are type aware
    cout << ch << endl; // Prints: A
    cout << number << endl; // Prints: 65

    // Both are integer type and are equal values
    cout << (static_cast<int>(ch) == number) << endl;
    cout << (static_cast<char>(number) == ch) << endl;
    cout << (ch == number) << endl;

    cout << "Enter a character _";
    char inputChar;
    cin >> inputChar;

    cout << "You entered: " << inputChar << endl;

    // cout.put() remains useful when we want to be explicit about outputting a character.
    cout << "You entered: ";
    cout.put(inputChar) << endl;

    return 0;
}
