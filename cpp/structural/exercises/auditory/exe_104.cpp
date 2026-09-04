// Да се напише функција која за дадена текстуална низа ќе одредува дали таа е доволно сложена за да биде лозинка.
// Секоја лозинка мора да содржи барем една буква, барем една цифра и барем еден специјален знак

#include <iostream>
#include <cctype>
#include <cstring>
using namespace std;

bool valid_password(const char *password) {
    bool contains_letters = false;
    bool contains_digits = false;
    bool contains_specials = false;

    for (int i = 0; i < strlen(password); i++) {
        if (isalpha(password[i])) {
            contains_letters = true;
        }
        if (isdigit(password[i])) {
            contains_digits = true;
        }
        if (!isalnum(password[i])) {
            contains_specials = true;
        }
    }

    return contains_letters && contains_digits && contains_specials;
}

int main() {
    char str[100];
    cin.getline(str, 100);

    if (valid_password(str)) {
        cout << "Valid password" << endl;
    } else {
        cout << "Invalid password" << endl;
    }
}
