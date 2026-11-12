/*
    === 8. ===
    vnesuvas n broj na stringovi, i za sekoj broj vo stringot da se zameni so prvata bukva na toj broj.
    Na primer za brojot 1 bi bilo bukvata 'o' (one), za 2 i 3 bi bila bukvata 't' (two,three), isto taka da se izbrishat site prazni mesta
*/
#include <iostream>
#include <cstring>
#include <cctype>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char alpha[10] = {'z', 'o', 't', 't', 'f', 'f', 's', 's', 'e', 'n'};

    for (int i = 0; i < n; i++) {
        char str[101];
        cin.getline(str, 101);

        int length = strlen(str);

        // 1. Чекор: Замена на цифрите со соодветните букви
        for (int j = 0; j < length; j++) {
            if (isdigit(str[j])) {
                // Го претвораме карактерот (пр. '1') во број (1) со одземање на '0'
                int digit_value = str[j] - '0';
                str[j] = alpha[digit_value];
            }
        }

        // 2. Чекор: Бришење на празните места во истиот стринг
        int write = 0;
        for (int j = 0; j < length; j++) {
            if (!isspace(str[j])) {
                str[write++] = str[j];
            }
        }
        str[write] = '\0'; // КЛУЧНО: Ставаме крај на новиот скратен стринг

        cout << str << endl;
    }

    return 0;
}
