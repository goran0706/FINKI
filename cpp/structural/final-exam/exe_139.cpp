/*
    Од стандарден влез прво се читаат два знака z1 и z2 , а потоа се читаат редови со низи од знаци се’
    додека не се прочита знакот # (секој од редовите не е подолг од 80 знаци).

    Да се напише програма со која на стандарден излез ќе се испечатат поднизите од секој ред составени од знаците
    што се наоѓаат меѓу z1 и z2 (без нив). Секоја подниза се печати во нов ред.

    Се смета дека секој ред од датотеката точно еднаш ги содржи знаците z1 и z2,
    знакот z1 секогаш се наоѓа пред знакот z2, а меѓу z1 и z2 секогаш има барем еден знак.

    Input:
    0 9
    nfjskdz0nvjkfdmnlks9bvfkjmcdz,
    bfhjdskvfdkl0fvkdzddjmje k dmkldz kdfds!%mlacsd9
    0fbnrjkdn9
    fjkd0jdfkfmjndksfjd;sj sad;jm 9nfcjka
    #

    Output:
    nvjkfdmnlks
    fvkdzddjmje k dmkldz kdfds!%mlacsd
    fbnrjkdn
    jdfkfmjndksfjd;sj sad;jm
*/
#include <iostream>
using namespace std;

int main() {
    char c1, c2;
    cin >> c1 >> c2;
    cin.ignore();

    char str[80];

    while (cin.getline(str, 80)) {
        if (str[0] == '#') {
            break;
        }

        int c1_idx = -1;
        int c2_idx = -1;

        for (int i = 0; str[i] != '\0'; i++) {
            if (c1_idx == -1 && str[i] == c1) {
                c1_idx = i + 1;
            } else if (str[i] == c2) {
                c2_idx = i;
            }
        }

        for (int i = c1_idx; i < c2_idx; i++) {
            cout << str[i];
        }
        cout << endl;
    }
}
