/*
    2. Редови со самогласки во датотека

    Дадена е текстуална датотека “Primer.txt”.

    Да се напише програма која ќе ја прочита датотеката и на екран ќе го отпечати бројот на редови
    во кои има повеќе од 10 самогласки, како и вкупниот број на самогласки во датотеката.

    Пример. Ако датотеката “Primer.txt” ја има следнава содржина:

    Zdravo, kako si?
    Eve, dobro sum. A ti?
    I jas dobro. Kako se tvoite? Ima li neshto novo?
    Dobri se i tie. Si kupiv avtomobil.

    тогаш програмата треба да отпечати:

    Vkupno 2 reda imaat povekje od 10 samoglaski.
    Vo datotekata ima vkupno 42 samoglaski.

*/
#include <iostream>
#include <fstream>
#include <ctype.h>

using namespace std;

// Pure utility function to filter characters
int is_vowel(char c) {
    c = tolower(c);
    return (c == 'a') || (c == 'e') || (c == 'i') || (c == 'o') || (c == 'u');
}

int main() {
    // WHY IFSTREAM? Allocates a system file handle input buffer stream.
    ifstream fin("Primer.txt");

    // Safety guard checking if the system block locked the file successfully
    if (!fin.is_open()) {
        cout << "Critical Error: Could not open file Primer.txt!" << endl;
        return -1;
    }

    char c;
    int matchingLinesCount = 0, totalVowelsCount = 0, currentLineVowelsCount = 0;

    // WHY fin.get(c)? Standard extraction operations (fin >> c) automatically
    // skip whitespace buffers and newline (\n) formatting characters.
    // fin.get() forces raw byte extractions, allowing us to accurately catch line ends.
    while (fin.get(c)) {
        if (is_vowel(c)) {
            ++currentLineVowelsCount;
            ++totalVowelsCount;
        }
        if (c == '\n') {
            if (currentLineVowelsCount > 10) {
                matchingLinesCount++;
            }
            currentLineVowelsCount = 0; // Reset metrics context for the new line
        }
    }

    // FIXED: Catch trailing line structures that omit an explicit final '\n' sequence
    if (currentLineVowelsCount > 10) {
        matchingLinesCount++;
    }

    cout << "Total of " << matchingLinesCount << " lines have more than 10 vowels." << endl;
    cout << "The document contains a total of " << totalVowelsCount << " vowels." << endl;

    return 0;
}
