// Да се напише функција која ќе одредува дали една текстуална низа е подниза на друга текстуална низа.

#include <iostream>
#include <cstring>

using namespace std;

bool is_substring(const char *s1, const char *s2) {
    if (s2[0] == '\0') return true; // Empty always present
    if (strlen(s2) > strlen(s1)) return false; // Can't be longer

    // Try each starting position in s1
    for (int i = 0; s1[i] != '\0'; i++) {
        int j = 0;

        // Match s2 character by character
        while (s2[j] != '\0' && s1[i + j] == s2[j]) {
            j++;
        }

        // If j reached end of s2, we matched the whole thing
        if (s2[j] == '\0') {
            return true;
        }
    }

    return false;
}


int main() {
    char s1[50];
    cin.getline(s1, 50);

    char s2[50];
    cin.getline(s2, 50);

    if (is_substring(s1, s2)) {
        cout << "Is a substring" << endl;
    } else {
        cout << "Is not a substring" << endl;
    }
}
