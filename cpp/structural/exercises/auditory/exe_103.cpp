// Да се напише функција која ќе проверува дали дадена текстуална низа е палиндром.
// - итеративно
// - рекурзивно

#include <iostream>
#include <cstring>
using namespace std;

bool is_palindrome_iterative(const char *str) {
    const int n = static_cast<int>(strlen(str));
    for (int i = 0; i < n / 2; i++) {
        if (str[i] != str[n - 1 - i]) {
            return false;
        }
    }
    return true;
}

bool is_palindrome_recursive(const char *str, int left, int right) {
    if (left >= right) return true;
    if (str[left] != str[right]) return false;
    return is_palindrome_recursive(str, left + 1, right - 1);
}

int main() {
    char str[100];
    cin.getline(str, 100);

    if (is_palindrome_iterative(str)) {
        cout << "Is palindrome" << endl;
    } else {
        cout << "Not palindrome" << endl;
    }

    const int n = static_cast<int>(strlen(str));

    if (is_palindrome_recursive(str, 0, n - 1)) {
        cout << "Is palindrome" << endl;
    } else {
        cout << "Not palindrome" << endl;
    }

    return 0;
}
