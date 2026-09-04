// Da se vnesat n nizi od karakteri i da se najde najgolemata niza od niv.
// I vo nejze ako ja ima bukvata 's' ke se zameni so '$', a bukvata 'm' ke se zameni so '^^'
#include <cstring>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[100];
    char max_str[100];
    int max_length = 0;

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);
        int current_length = strlen(str);

        if (current_length > max_length) {
            max_length = current_length;
            strcpy(max_str, str);
        }
    }

    char tmp[] = "";
    int write = 0;

    for (int i = 0; str[i] != '\0'; i++) {
        if (tolower(str[i]) == 's') {
            tmp[write++] = '$';
        } else if (tolower(str[i]) == 'm') {
            tmp[write++] = '*';
            tmp[write++] = '*';
        } else {
            tmp[write++] = str[i];
        }
    }

    tmp[write] = '\0';
    cout << tmp << endl;

    return 0;
}
