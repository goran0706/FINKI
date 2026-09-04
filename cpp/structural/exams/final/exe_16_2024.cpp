/*
    ============================================================
    TASK 1
    ============================================================
    Се внесуваат низи од знаци од стандарден влез.
    Да се избројат и испечатат сите последователни појавувања на соседни самогласки во речениците.
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
using namespace std;

bool is_vowel(const char ch) {
    const char c = tolower(ch);
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
    char str[101];

    int count = 0;

    while (true) {
        cin.getline(str, 101);

        if (str[0] == '#') {
            break;
        }

        for (int i = 0; str[i] != '\0'; i++) {
            if (is_vowel(str[i]) && is_vowel(str[i + 1])) {
                cout << char(tolower(str[i])) << char(tolower(str[i + 1])) << "\n";
                count++;
            }
        }
    }

    cout << count << endl;

    return 0;
}
