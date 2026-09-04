// Vnesuvas n broj na stringovi, i za sekoj broj vo stringot da se zameni so prvata bukva na toj broj.
// Na primer za brojot 1 bi bilo bukvata 'o' (one), za 2 i 3 bi bila bukvata 't' (two,three), isto taka da se izbrishat site prazni mesta
#include <cstring>
#include <cctype>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[100];

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);

        // 1. Replace character
        int length = strlen(str);

        for (int j = 0; j < length; j++) {
            if (isdigit(str[j])) {
                constexpr char char_map[10] = {'z', 'o', 't', 't', 'f', 'f', 's', 's', 'e', 'n'};
                str[j] = char_map[str[j] - '0']; // ASCII
            }
        }

        // 2. Remove empty spaces
        int write = 0;

        for (int j = 0; j < length; j++) {
            if (isspace(str[j])) {
                continue;
            }

            str[write++] = str[j];
        }

        cout << str << endl;
    }

    return 0;
}
