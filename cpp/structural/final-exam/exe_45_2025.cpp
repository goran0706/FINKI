/*
    === 11. ===
    se vnesuvaat N nizi od vlez, da se proveri dali nizite se palindrom(vo posebna funcija) i
    ako ima povekje da se ispecati najmalata niza najdena palindrom niza.
*/
#include <cstring>
#include <iostream>
using namespace std;

bool is_palindrome(const char *str) {
    const int n = strlen(str);

    for (int i = 0; i < n / 2; i++) {
        if (str[i] != str[n - 1 - i]) {
            return false;
        }
    }

    return true;
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[100];
    char copy[100] = "";
    bool found = false;
    int shortest = 101;

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);
        if (is_palindrome(str)) {
            int current_length = strlen(str);
            if (current_length < shortest) {
                shortest = current_length;
                strcpy(copy, str);
                found = true;
            }
        }
    }

    if (found) {
        cout << copy << endl;
    } else {
        cout << "No palindrome found." << endl;
    }

    return 0;
}
