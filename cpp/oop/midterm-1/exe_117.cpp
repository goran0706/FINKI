// Define a class Word that will have dynamically allocated array of characters. The class should only allow constructing objects by single constructor with one argument (array of characters), and if this argument is missing its value should be "UNDEFINED".
//
// Define a class Sentence that contains:
//
//     dynamically allocated array of objects of class Word
//     number of words
//     total capacity.
//
// For this class define constructor with single argument, the max capacity of words, which will be predefined to 10 if missing. Implement the following methods:
//
//     void add(Word w) for adding a new word in the array of words. During addition if the capacity is full, a new extended array is allocated increased for 10 new words,
//     print() that will print all the words separated with one blank space,
//     swap(int i, int j) that will swap the words in the array at the passed indices i and j.
//
// For example:
// Input 	Result
//
// 30
// centigram&apos;s
// removers
// specious
// criminologist
// overachiever&apos;s
// interstice
// animatedly
// drapery
// insoles
// backache
// Carborundum
// vizor
// firming
// sideswiping
// tingling
// silkworm
// avoirdupois
// chalet&apos;s
// Kodachrome&apos;s
// fuddled
// doubloon
// rector
// firmly
// solider
// dillydallied
// Schlesinger&apos;s
// explosiveness
// Zsigmondy
// agronomists
// pushy
//
//
//
// CONSTRUCTOR
// ADD WORD
// PRINT SENTENCE
// centigram&apos;s removers specious criminologist overachiever&apos;s interstice animatedly drapery insoles backache Carborundum vizor firming sideswiping tingling silkworm avoirdupois chalet&apos;s Kodachrome&apos;s fuddled doubloon rector firmly solider dillydallied Schlesinger&apos;s explosiveness Zsigmondy agronomists pushy
// COPY
// SWAP
// centigram&apos;s removers specious criminologist overachiever&apos;s interstice animatedly drapery insoles backache silkworm vizor firming sideswiping tingling Carborundum avoirdupois chalet&apos;s Kodachrome&apos;s fuddled doubloon rector firmly solider dillydallied Schlesinger&apos;s explosiveness Zsigmondy agronomists pushy
// ORIGINAL
// centigram&apos;s removers specious criminologist overachiever&apos;s interstice animatedly drapery insoles backache Carborundum vizor firming sideswiping tingling silkworm avoirdupois chalet&apos;s Kodachrome&apos;s fuddled doubloon rector firmly solider dillydallied Schlesinger&apos;s explosiveness Zsigmondy agronomists pushy

#include <iostream>
#include <cstring>
using namespace std;

// your code here

int main() {
    int n;
    cin >> n;
    cin.get();
    cout << "CONSTRUCTOR" << endl;
    Sentence s;
    cout << "ADD WORD" << endl;
    for (int i = 0; i < n; ++i) {
        char w[100];
        cin.getline(w, 100);
        Word word(w);
        s.add(word);
    }
    cout << "PRINT SENTENCE" << endl;
    s.print();
    cout << "COPY" << endl;
    Sentence x = s;
    cout << "SwAP" << endl;
    x.swap(n / 2, n / 3);
    x.print();
    cout << "ORIGINAL" << endl;
    s.print();
    return 0;
}
