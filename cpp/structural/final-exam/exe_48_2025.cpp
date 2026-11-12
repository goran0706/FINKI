/*
    === 14. ===
    da se vnesat n nizi od karakteri i da se najde najgolemata niza od niv.
    I vo nejze ako ja ima bukvata 's' ke se zameni so '$', a bukvata 'm' ke se zameni so '**'.
*/
#include <cstring>
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    int max_length = 0;
    char max_str[101] = "";
    char str[101];

    // 1. Find the largest string
    for (int i = 0; i < n; i++) {
        cin.getline(str, 101);
        int current_length = strlen(str);
        if (current_length > max_length) {
            max_length = current_length;
            strcpy(max_str, str);
        }
    }

    // 2. Process largest string
    int write_index = 0;
    char output[101] = "";

    for (int read = 0; max_str[read] != '\0'; read++) {
        char current_char = tolower(max_str[read]);

        if (current_char == 's') {
            output[write_index++] = '$';
        } else if (current_char == 'm') {
            output[write_index++] = '*';
            output[write_index++] = '*';
        } else {
            output[write_index++] = max_str[read];
        }
    }

    output[write_index] = '\0';
    cout << max_length << ": " << output << endl;

    return 0;
}
