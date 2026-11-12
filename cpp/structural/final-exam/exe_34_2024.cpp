/*
    ============================================================
    TASK 19
    ============================================================
    Caesar-шифра со поместување X.
    Имплементацијата мора да биде рекурзивна.
*/
#include <iostream>
using namespace std;

void encrypt_caesar_cipher(char *str, int x) {
    if (*str == '\0') return;

    x = x % 26; // Го кратиме x веднаш (на пр. 31 станува 5)

    if (*str >= 'A' && *str <= 'Z') {
        *str = (*str - 'A' + x) % 26 + 'A';
    } else if (*str >= 'a' && *str <= 'z') {
        *str = (*str - 'a' + x) % 26 + 'a';
    }

    encrypt_caesar_cipher(str + 1, x);
}

void decrypt_caesar_cipher(char *str, int x) {
    if (*str == '\0') return;

    x = x % 26;

    if (*str >= 'A' && *str <= 'Z') {
        *str = (*str - 'A' - x + 26) % 26 + 'A';
    } else if (*str >= 'a' && *str <= 'z') {
        *str = (*str - 'a' - x + 26) % 26 + 'a';
    }

    decrypt_caesar_cipher(str + 1, x);
}

int main() {
    char str[101];
    cin.getline(str, 101);

    int x;
    cin >> x;

    cout << str << endl;

    encrypt_caesar_cipher(str, x);
    cout << str << endl;

    decrypt_caesar_cipher(str, x);
    cout << str << endl;

    return 0;
}
