// TASK 2 - Text transformation
//
// Write a program that reads an integer , followed by n lines of text
// For each line, perform the following transformation using a function.
//
// - Remove all letters that belong to the top row of the keyboard: q w e r t y u i o p (both lowercase and uppercase).
// - Replace every whitespace character with a dot.
//
// After the transformation, print each modified line.
#include <cstring>
#include <cctype>
#include <iostream>
using namespace std;

bool is_top_row(const char ch) {
    const char c = tolower(ch);
    return c == 'q' || c == 'w' || c == 'e' || c == 'r' || c == 't' ||
           c == 'y' || c == 'u' || c == 'i' || c == 'o' || c == 'p';
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[100];

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);

        // GOOD - using write index to remove characters
        int index = 0;

        for (int j = 0; str[j] != '\0'; j++) {
            if (isalpha(str[j]) && is_top_row(str[j])) {
                continue;
            }

            if (isspace(str[j])) {
                str[index++] = '.';
            } else {
                str[index++] = str[j];
            }
        }

        str[index] = '\0'; // Terminate the string at the new length

        // BAD - this algorithm works but is not optimal.
        // j-- forces reiteration until the end of the string.
        // for (int j = 0; str[j] != '\0'; j++) {
        //     if (isalpha(str[j]) && is_top_row(str[j])) {
        //         for (int k = j; str[k] != '\0'; k++) {
        //             str[k] = str[k + 1];
        //         }
        //         j--;
        //     }
        //
        //     if (isspace(str[j])) {
        //         str[j] = '.';
        //     }
        // }

        cout << str << endl;
    }

    return 0;
}

