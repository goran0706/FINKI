// String
// Vnesi broj n, niza od zbor i potoa  vnesi n nizi.
// Za sekoja niza da se ispecati kolku recenici e (pocnuvajki od 0) i kolku pati posledovatelno se pojavuva prvata niza vo sekoja niza
// Na pr:
// 2
// 2024
// Srekna nova 2024!
// Srekja i zdravje vo novata 20242024 godina. Vi posakuvame se najdobro!

// Output:
// 0:1
// 1:2
#include <cstring>
#include <iostream>
using namespace std;

int occurrences_count(char *text, char *pattern) {
    int text_length = strlen(text);
    int pattern_length = strlen(pattern);

    if (pattern_length == 0 || pattern_length > text_length) {
        return 0;
    }

    int count = 0;

    // Се движиме низ текстот до точката каде што сè уште може да го собере бараниот збор
    for (int i = 0; i <= text_length - pattern_length; i++) {
        // &text[i] дава мемориска адреса на карактерот од 'i', што за strncmp претставува почеток на нов подстринг.
        // strncmp проверува дали тој подстринг започнува со бараниот збор во должина од pattern_length карактери.
        // Враќа 0 ако се идентични (разликата на нивните ASCII вредности е 0, пр. 'A' - 'A' = 0).
        if (strncmp(&text[i], pattern, pattern_length) == 0) {
            count++;
        }
    }

    return count;
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char pattern[10];
    cin.getline(pattern, 10);

    char text[101];
    for (int i = 0; i < n; i++) {
        cin.getline(text, 101);
        cout << i << ":" << occurrences_count(text, pattern) << endl;
    }

    return 0;
}
