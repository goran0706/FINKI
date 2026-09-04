// Да се напише програма што за знак внесен од тастатура ќе одреди дали е самогласка, цифра или другo.

#include <iostream>
using namespace std;

int main() {
    char c;
    cin >> c;

    switch (c) {
        case 'A':
        case 'E':
        case 'I':
        case 'O':
        case 'U':
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'u': {
            cout << "Vowel";
            break;
        }
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 0: {
            cout << "Digit";
            break;
        }
        default: {
            cout << "Something else";
        }
    }

    return 0;
}
