// 8. Write a program that uses an array of char and a loop to read one word at a time until the word done is entered.
// The program should then report the number of words entered (not counting done). A sample run could look like this:

// Enter words (to stop, type the word done):
// anteater birthday category dumpster
// envy finagle geometry done for sure
// You entered a total of 7 words.

// You should include the cstring header file and use the strcmp() function to make the comparison test.

#include <cstring>
#include <iostream>
using namespace std;

int main() {
    const int ArrSize = 30;
    char word[ArrSize];

    int count = 0;

    cout << "Enter words (to stop, type the word done):" << endl;
    while (cin.getline(word, ArrSize)) {
        if (!strcmp(word, "done")) {
            break;
        }
        count++;
    }

    cout << "You entered a total of " << count << " words." << endl;
    return 0;
}
