/*
    ============================================================
    TASK 12 — Recursive Uppercase Search
    ============================================================
    За низа од знаци (до 100) да се пронајде првата голема буква со рекурзивна функција.
    Ако не постои → се враќа '\0'.

    Input:
      daNh5}cFVfj.aQsC06eTHr;y0;!YZ~S;%cF{

    Output:
      N
*/
#include <iostream>
using namespace std;

char find_first_uppercase(const char *str) {
    if (*str == '\0') {
        return '\0';
    }

    if (isupper(*str)) {
        return *str;
    }

    return find_first_uppercase(str + 1);
}

int main() {
    char str[101];
    cin.getline(str, 101);

    char result = find_first_uppercase(str);

    if (result != '\0') {
        cout << result << endl;
    } else {
        cout << "\\0" << endl;
    }

    return 0;
}
