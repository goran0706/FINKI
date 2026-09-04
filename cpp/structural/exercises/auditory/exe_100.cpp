// Да се напише функција што ќе ја одредува должината на една текстуална низа.
// Да се даде итеративно и рекурзивно решение

#include <iostream>
using namespace std;

int length_iterative(const char *str) {
    int count = 0;
    while (*str != '\0') {
        count++;
        str++;
    }
    return count;
}

int length_recursive(const char *str) {
    if (*str == '\0') return 0;
    return length_iterative(++str) + 1;
}

int main() {
    char str[31];
    cin >> str;
    str[30] = '\0';

    cout << "str length = " << length_iterative(str) << endl;
    cout << "str length = " << length_recursive(str) << endl;

    // =========================================
    // READ - single word
    // =========================================
    // Reads a single word until a null value

    // cin >> str;

    // =========================================
    // READ - multiple words
    // =========================================
    // Reads a whole sentence including spaces

    // cin.get();
    // cin.getline();
    // getline(cin, str);
}
