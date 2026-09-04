// Да се провери дали е валиден password:
// - мин должина
// - голема буква
// - мала буква
// - бројка
// - специјален карактер

#include <iostream>
#include <cstring>
using namespace std;

bool valid_password(const char *password) {
    int length = strlen(password);
    if (length < 8) return false;

    bool contains_upper = false;
    bool contains_lower = false;
    bool contains_digits = false;
    bool contains_specials = false;

    for (int i = 0; i < length; i++) {
        if (isalpha(password[i])) {
            if (isupper(password[i])) {
                contains_upper = true;
            } else {
                contains_lower = true;
            }
        }
        if (isdigit(password[i])) {
            contains_digits = true;
        }
        if (!isalnum(password[i])) {
            contains_specials = true;
        }
    }

    return contains_upper && contains_lower && contains_digits && contains_specials;
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
