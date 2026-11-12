// Vnesuvas n broj na stringovi, i za sekoj broj vo stringot da se zameni so prvata bukva na toj broj.
// Na primer za brojot 1 bi bilo bukvata 'o' (one), za 2 i 3 bi bila bukvata 't' (two,three), isto taka da se izbrishat site prazni mesta
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[101];
    char c[] = {'z', 'o', 't', 't', 'f', 'f', 's', 's', 'e', 'n'};

    for (int i = 0; i < n; i++) {
        cin.getline(str, 101);

        int index = 0;

        for (int j = 0; str[j] != '\0'; j++) {
            if (isspace(str[j])) {
                continue;
            }
            if (isdigit(str[j])) {
                str[index++] = c[str[j] - '0'];
            } else {
                str[index++] = str[j];
            }
        }

        str[index] = '\0';

        cout << str << endl;
    }
}

