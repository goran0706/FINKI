// 3
// Da se vnesat n nizi od karakteri i da se najde najgolemata niza od niv.
// I vo nejze ako ja ima bukvata 's' ke se zameni so '$', a bukvata 'm' ke se zameni so '**'.

#include <cstring>
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[200];
    char max_str[200];
    int max_length = -1;

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);
        int current_length = strlen(str);

        if (current_length > max_length) {
            max_length = current_length;
            strcpy(max_str, str);
        }
    }

    int length = strlen(max_str);

    for (int i = 0; i < length; i++) {
        if (tolower(max_str[i]) == 's') {
            max_str[i] = '$';
        } else if (tolower(max_str[i]) == 'm') {
            // Бидејќи стрингот се шири, десниот дел го поместуваме за 1 место во десно
            // Внимавај: циклусот почнува од 'length' (вклучувајќи ја и '\0' нулата)
            for (int j = length; j > i; j--) {
                max_str[j + 1] = max_str[j];
            }

            max_str[i] = '*';
            max_str[i + 1] = '*';

            length++; // Мора да ја зголемиме вкупната должина бидејќи додадовме нов карактер
            i++; // Го прескокнуваме второто '*' за да не го проверуваме во следната итерација
        }
    }

    cout << max_str << endl;

    return 0;
}
