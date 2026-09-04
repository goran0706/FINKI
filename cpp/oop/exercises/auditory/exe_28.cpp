/*
    3. Читање ред по ред од датотека

    Да се напише програма која секој ред од дадена текстуална датотека “vlezna.txt” ќе го копира во друга датотека “izlezna.txt”,
    така што пред секој прочитан ред од датотеката “vlezna.txt” ќе додаде уште еден ред во кој ќе стои бројот на знаци што ги содржи прочитаниот ред.

    Во секој ред може да има најмногу 80 знаци.

    Пример. Ако датотеката “vlezna.txt” ја има следнава содржина:

    Jas ucham Objektno-orientirano Programiranje.
    Koga se polaga vtoriot kolokvium?
    Ne znam, seushte ne e objaveno na sajtot.

    тогаш по извршувањето на програмата содржината на датотеката “izlezna.txt” треба да биде следнава:

    45
    Jas ucham Objektno-orientirano Programiranje.
    33
    Koga se polaga vtoriot kolokvium?
    41
    Ne znam, seushte ne e objaveno na sajtot.
*/
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main() {
    ifstream fin("vlezna.txt");
    ofstream fout("izlezna.txt");

    // Strict validation ensuring file stream states are valid before performing reads/writes
    if (!fin.is_open()) {
        cout << "Critical Error: Failed to open source file vlezna.txt!" << endl;
        return -1;
    }
    if (!fout.is_open()) {
        cout << "Critical Error: Failed to open target destination file izlezna.txt!" << endl;
        return -1;
    }

    string lineContent;

    // WHY getline()? Instead of parsing character-by-character, getline() grabs
    // characters until it hits a newline, extracts them into our string block,
    // and automatically drops the delimiter byte to keep string data clean.
    // It evaluates to false when EOF (End Of File) is encountered, gracefully breaking the loop.
    while (getline(fin, lineContent)) {
        int lineLength = lineContent.length();

        // Write metrics data followed by contents directly into the stream pipeline
        fout << lineLength << endl;
        fout << lineContent << endl;
    }

    // Stream objects close automatically when they fall out of scope via RAII,
    // flushing all active hardware blocks securely.
    return 0;
}
