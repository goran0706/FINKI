/*
    Се внесуваат низи од значи од стандарден влез.
    Да се избројат и испечатат сите последнователни појавувања на соседни самогласки во речениците.
    Појавата на големи и мали букви да се игнорира.
    Пронајдените парови самогласки да се испечатат на екран, секој во нов ред со мали букви.
    Потоа во нов ред се печати бројот на појавувања на паровите самогласки.
    Читањето завршува кога ќе се прочита знакот #.

    Пример:

    IO is short for Input Output
    medioio medIo song
    #
    Излез:

    io
    ou
    io
    oi
    io
    io
    6

    Input:
    Why so serious?
    #

    Output:
    io
    ou
    2
*/
#include <iostream>
#include <cctype>
using namespace std;

bool is_vowel(char ch) {
    char lc = tolower(ch);
    return lc == 'a' || lc == 'e' || lc == 'i' || lc == 'o' || lc == 'u';
}


int main() {
    char str[100];

    int count = 0;

    while (cin.getline(str, 100)) {
        if (*str == '#') {
            break;
        }

        for (int i = 0; str[i] != '\0'; i++) {
            if (is_vowel(str[i]) && is_vowel(str[i + 1])) {
                cout << char(tolower(str[i])) << char(tolower(str[i + 1])) << endl;
                count++;
            }
        }
    }

    cout << count << endl;
}
