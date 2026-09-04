/*
    ============================================================
    TASK 8
    ============================================================
    Се читаат редови додека не се прочита 0.
    Да се најде најдолгиот ред со најмалку 2 цифри и да се испечати поднизата меѓу првата и последната цифра.
*/
#include <cstring>
#include <iostream>
using namespace std;

bool has_min_digits(char *str, int min) {
    int count = 0;
    for (int i = 0; str[i] != '\0'; i++) {
        if (isdigit(str[i])) {
            count++;
        }
    }
    return count >= min;
}

int main() {
    char str[101];
    char longest[101] = "";
    int maxLength = 0;

    // Step 1: Find the longest string
    while (cin.getline(str, 101)) {
        if (strcmp(str, "0") == 0) {
            break;
        }

        int currentLength = strlen(str);
        if (has_min_digits(str, 2) && currentLength > maxLength) {
            maxLength = currentLength;
            strcpy(longest, str);
        }
    }

    if (maxLength == 0) {
        return 0;
    }

    // Step 2: Print substring starting from the first until last digit
    int first_digit_index = -1;
    int last_digit_index = -1;

    for (int i = 0; i < maxLength; i++) {
        if (isdigit(longest[i])) {
            if (first_digit_index == -1) {
                first_digit_index = i;
            }
            last_digit_index = i;
        }
    }

    for (int i = first_digit_index; i <= last_digit_index; i++) {
        cout << longest[i];
    }
    cout << endl;

    return 0;
}
