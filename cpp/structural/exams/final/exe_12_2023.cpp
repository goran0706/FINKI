/*
    ============================================================
    TASK 9 — Recursive Punctuation Search
    ============================================================
    За низа од знаци (до 100) да се пронајде првиот интерпункциски знак користејќи рекурзивна функција.

    Ако не постои → се враќа '\0'.

    Input:
      daNh5 }cFVfj.aQsC06eTHr;y0;!YZ~S;%cF{

    Output:
      }
*/
#include <iostream>
using namespace std;

char find_first_punctuation(const char *str) {
    if (*str == '\0') {
        return '\0';
    }

    if (ispunct(*str)) {
        return *str;
    }

    return find_first_punctuation(str + 1);
}

int main() {
    // Простор за низа до 100 знаци + '\0'
    char str[101];

    // Бидејќи стрингот содржи празни места или специјални знаци,
    // користиме cin.getline за да го прочитаме целиот ред одеднаш.
    cin.getline(str, 101);

    char result = find_first_punctuation(str);

    // Печатење на резултатот
    if (result != '\0') {
        cout << result << endl;
    } else {
        // Го печати текстот \0 ако нема знак
        cout << "\\0" << endl;
    }

    return 0;
}
