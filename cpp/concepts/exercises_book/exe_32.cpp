// 9. Write a program that matches the description of the program in Programming Exercise 8, but use a string class object
// instead of an array. Include the string header file and use a relational operator to make the comparison test.

#include <cstring>
#include <iostream>
using namespace std;

int main() {
    string word = {};
    int count = 0;

    cout << "Enter words (to stop, type the word done):" << endl;
    while (getline(cin, word)) {
        if (word == "done") {
            break;
        }
        count++;
    }

    cout << "You entered a total of " << count << " words." << endl;
    return 0;
}
