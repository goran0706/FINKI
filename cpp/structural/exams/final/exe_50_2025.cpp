// Од стандарден влез се внесуваат непознат број на реченици претставени преку текстуални низи (стрингови)
// секоја не подолга од 100 знаци и секоја во нов ред.
// Програмата треба да го најде стрингот кој содржи најмногу сврзници и да го испечати заедно со бројот на најдените сврзници.
// За сврзници се сметаат сите зборови составени од една, две или три букви.
// Зборовите во текстуалната низа се одделени со едно или повеќе прзани места и/или интерпункциски знак.
#include <iostream>
#include <cctype>
#include <cstring>
using namespace std;

int main() {
    int max_count = 0;
    char output_str[100] = "";
    char str[100];

    while (cin.getline(str, 100)) {
        if (str[0] == '!') {
            break;
        }

        int letter_count = 0;
        int word_count = 0;
        int len = strlen(str);

        for (int i = 0; i < len; i++) {
            if (isalpha(str[i])) {
                letter_count++;
            } else {
                if (letter_count > 0) {
                    if (letter_count <= 3) {
                        word_count++;
                    }
                    letter_count = 0;
                }
            }
        }

        if (letter_count > 0) {
            if (letter_count <= 3) {
                word_count++;
            }
        }

        if (word_count > max_count) {
            max_count = word_count;
            strcpy(output_str, str);
        }
    }

    cout << max_count << ": " << output_str << endl;

    return 0;
}
