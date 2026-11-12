// Да се напише програма која чита голема буква од стандарден влез и ја печати истата како мала буква.
// - Напомена: Секој знак се претставува со ASCII број.

#include <iostream>
using namespace std;

int main() {
    char c;
    cin >> c;

    // Char is the smallest of integer types - 1 byte | 8 bits | 256 values
    // Every character and symbol is represented by an integer value in ASCII

    // To convert a character to uppercase or lowercase:
    // 1. Find the ASCII number difference between uppercase and lowercase ('a' - 'A')
    // 2. To uppercase - subtract character number by the ASCII difference
    // 3. To lowercase - add the ASCII difference to the character number
    if (c >= 'A' && c <= 'Z') {
        cout << static_cast<char>(c + ('a' - 'A')) << endl;
    } else if (c >= 'a' && c <= 'z') {
        cout << static_cast<char>(c - ('a' - 'A')) << endl;
    } else {
        cout << "Invalid character" << endl;
    }

    return 0;
}
