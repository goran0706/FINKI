// Да се напише функција која во стринг што и се предава како влезен параметар
// ќе ги промени малите букви во големи и обратно, и ќе ги отстрани сите цифри и специјални знаци.

#include <iostream>
#include <cstring>
using namespace std;

void case_conversion(char *str) {
    const int len = int(strlen(str));

    for (int i = 0; i < len; i++) {
        if (isalpha(str[i])) {
            if (isupper(str[i])) {
                str[i] = char(tolower(str[i]));
            } else {
                str[i] = char(toupper(str[i]));
            }
        }
    }
}

int main() {
    char str[100];
    cin.getline(str, 100);

    case_conversion(str);

    cout << str << endl;
}
