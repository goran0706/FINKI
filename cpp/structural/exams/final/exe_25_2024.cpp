/*
    ============================================================
    TASK 10
    ============================================================
    Се читаат два знака z1 и z2.
    Потоа се читаат редови до #.
    Да се испечатат поднизите меѓу z1 и z2.
*/
#include <cstring>
#include <iostream>
using namespace std;

int main() {
    char c1, c2;
    cin >> c1 >> c2;
    cin.ignore();

    char str[101];

    while (cin.getline(str, 101)) {
        if (strcmp(str, "#") == 0) {
            break;
        }

        int length = strlen(str);

        for (int i = 0; i < length; i++) {
            if (str[i] == c1) {
                int end = -1;

                for (int j = i + 1; j < length; j++) {
                    if (str[j] == c2) {
                        end = j;
                        break;
                    }
                }

                if (end != -1) {
                    for (int j = i + 1; j < end; j++) {
                        cout << str[j];
                    }
                    cout << " ";
                    i = end;
                }
            }
        }
    }

    return 0;
}
