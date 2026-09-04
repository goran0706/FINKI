/*
    Од стандарден влез се читаат низи од знаци се додека не се прочита знакот #.
    Да се напише програма во која од за секој прочитан ред ќе се отпечати бројот на цифри во тој ред, знакот :,
    па самите цифри подредени според ASCII кодот во растечки редослед.
    Низите од знаци не се подолги од 100 знаци.

    Input:
    74I9BjpbhbsfX6Ai0xtnmv4csz2gNv
    wtkb3Y82B9oygnG1vhRsMOuman2n894v08w4pI3e4x
    p7A3pO1U70aeGxwpOptb2rie
    nw01MAok4HWisf913hjtiyscgwhdr7w92lm7eddhy6ne40fHbsZc3ac
    Zmwk1yrnqt0LjT6ItS2kH
    kfcp3Xpxx030B0ojf2G2o4JgkTsolbxqgxkifmbwrxRevKum8tvq4FZxi9LsUM2bq3jGjuo0eu4iv6
    W79qURXz32tn8gdzAmasf019JdFbVtizbwu1t09dlkLfpxF1dw7g4wqHSLgEojK27bYP
    wyqzCunXvicN1D31v41hbhvmC45m69u587aW0gAZ4mvhypshmn0kVs
    #
    
    Output:
    7:0244679
    14:01223344488899
    6:012377
    14:00112334467799
    4:0126
    16:0000222333444689
    16:0011122347778999
    15:001113444556789
*/
#include <iostream>
using namespace std;

void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }
}

int main() {
    char str[100];

    while (cin.getline(str, 100)) {
        if (str[0] == '#') {
            break;
        }

        int count = 0;
        int digits[100];

        for (int i = 0; str[i] != '\0'; i++) {
            if (isdigit(str[i])) {
                digits[count++] = str[i];
            }
        }

        bubble_sort(digits, count);

        cout << count << ":";
        for (int i = 0; i < count; i++) {
            cout << char(digits[i]);
        }
        cout << endl;
    }
}
