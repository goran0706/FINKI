// Од стандарден влез се читаат низи од знаци се додека не се прочита знакот #.
// Да се напише програма во која за секој прочитан ред ќе се отпечати бројот на цифри во тој ред,
// знакот :, па самите цифри подредени според ASCII кодот во растечки редослед.
// Низите од знаци не се подолги од 100 знаци.
//
// Input:
// 74I9BjpbhbsfX6Ai0xtnmv4csz2gNv
// wtkb3Y82B9oygnG1vhRsMOuman2n894v08w4pI3e4x
// p7A3pO1U70aeGxwpOptb2rie
// nw01MAok4HWisf913hjtiyscgwhdr7w92lm7eddhy6ne40fHbsZc3ac
// Zmwk1yrnqt0LjT6ItS2kH
// kfcp3Xpxx030B0ojf2G2o4JgkTsolbxqgxkifmbwrxRevKum8tvq4FZxi9LsUM2bq3jGjuo0eu4iv6
// W79qURXz32tn8gdzAmasf019JdFbVtizbwu1t09dlkLfpxF1dw7g4wqHSLgEojK27bYP
// wyqzCunXvicN1D31v41hbhvmC45m69u587aW0gAZ4mvhypshmn0kVs
// #
//
// Output:
// 7:0244679
// 14:01223344488899
// 6:012377
// 14:00112334467799
// 4:0126
// 16:0000222333444689
// 16:0011122347778999
// 15:001113444556789
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    char str[101];

    while (cin.getline(str, 101)) {
        if (str[0] == '#') {
            break;
        }

        int digits_counter = 0;
        char digits[101];

        // 1. Извлечи ги само цифрите
        for (int i = 0; str[i] != '\0'; i++) {
            if (isdigit(str[i])) {
                digits[digits_counter++] = str[i];
            }
        }
        digits[digits_counter] = '\0';

        // 2. Сортирај ја само низата 'digits' (долга е точно digits_counter)
        // Selection Sort
        // for (int i = 0; i < digits_counter - 1; i++) {
        //     for (int j = i + 1; j < digits_counter; j++) {
        //         if (digits[i] > digits[j]) {
        //             swap(digits[i], digits[j]);
        //         }
        //     }
        // }

        // Bubble Sort
        for (int i = 0; i < digits_counter - 1; i++) {
            bool swapped = false;

            for (int j = 0; j < digits_counter - 1 - i; j++) {
                if (digits[j] > digits[j + 1]) {
                    swap(digits[j], digits[j + 1]);
                    swapped = true;
                }
            }

            if (!swapped) {
                break;
            }
        }

        // 3. Печатење во бараниот формат
        cout << digits_counter << ":" << digits << endl;
    }

    return 0;
}
