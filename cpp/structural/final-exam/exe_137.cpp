/*
    Од стандарден влез се читаат непознат број на редови додека не се прочита 0.
    Да се најде најдолгиот ред во кој има барем 2 цифри.
    Потоа, на стандарден излез да се испечатат знаците од најдолгиот ред кои се наоѓаат
    помеѓу првата и последната цифра (заедно со тие 2 цифри) во истиот редослед.
    Доколку има повеќе такви редови се печати последниот.
    Се претпоставува дека ниту еден ред не е подолг од 100 знаци.

    Пример.

    Влез:
    dat.txt:
    aaa123aa222aa2aaa23aaaaa22
    aaaaaaaaaaaa 23aaaa
    123 aaa aaa aaa aaa 12345 aaa aaa 2a
    0

    Излез:
    123 aaa aaa aaa aaa 12345 aaa aaa 2

    Input
    aaa123aa222aa2aaa23aaaaa22 11112 222311111
    aaa123aa222aa2aaa23aaaaa22 11112 aaaaaaaa1
    aaa123aa222aa2aaa23aaaaa22 11112 2a23111a1
    aaa123aa222aa2aaa23aaaaa22 11112 222311aa1
    aaa123aa222aa2aaa23aaaaa22 11112 222311111
    aaa123aa222aa2aaa21aa11122 11112 aaaa11111
    1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    0

    Result
    123aa222aa2aaa21aa11122 11112 aaaa11111
*/
#include <cstring>
#include <fstream>
#include <iostream>
using namespace std;

constexpr char READ_FILE[] = "0_read_file.txt";

int main() {
    // If required to read input from a file
    ifstream infile(READ_FILE);
    if (!infile) return 0;

    // Core logic regardless of where the input data comes from file or CLI
    char str[100];
    char max[100];
    int max_length = 0;

    while (infile.getline(str, 100)) {
        if (str[0] == '0') {
            break;
        }

        int digits = 0;
        int curr_length = strlen(str);

        for (int i = 0; str[i] != '\0'; i++) {
            if (isdigit(str[i])) {
                if (digits++ >= 2) break;
            }
        }

        if (digits >= 2 && curr_length > max_length) {
            max_length = curr_length;
            strcpy(max, str);
        }
    }

    int start = -1;
    int end = -1;

    for (int i = 0; max[i] != '\0'; i++) {
        if (isdigit(max[i])) {
            if (start == -1) {
                start = i;
            }
            end = i + 1;
        }
    }

    for (int i = start; i < end; i++) {
        cout << max[i];
    }
    cout << endl;
}
