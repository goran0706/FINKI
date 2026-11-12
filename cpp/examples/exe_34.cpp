// 1. Write a program that reads keyboard input to the @ symbol and that echoes the input except for digits, converting
// each uppercase character to lowercase, and vice versa. (Don’t forget the cctype family.)

#include <iostream>
#include <cctype>
using namespace std;

int main() {
    char ch;

    cout << "Enter your input: ";
    cin.get(ch);

    while (ch != '@') {
        if (isdigit(ch)) // skip digits silently
        {
            cin.get(ch);
            continue;
        }

        if (isupper(ch))
            cout << (char) tolower(ch);
        else if (islower(ch))
            cout << (char) toupper(ch);
        else
            cout << ch; // punctuation, spaces, etc. echoed as-is

        cin.get(ch);
    }

    return 0;
}
