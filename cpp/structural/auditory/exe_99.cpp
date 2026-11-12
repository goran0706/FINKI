// Да се напише функција што ќе одредува колку пати даден знак се наоѓа во даден стринг.
// Знакот за споредување и стрингот се внесуваат од тастатура.

#include <iostream>
using namespace std;

int char_counter(const char *str, const char c) {
    int count = 0;

    while (*str != '\0') {
        if (*str == c) {
            count++;
        }
        str++;
    }

    return count;
}

int main() {
    char c;
    cin >> c;

    char str[11];
    cin >> str;
    str[10] = '\0';

    cout << c << " appears " << char_counter(str, c) << " times." << endl;
}
