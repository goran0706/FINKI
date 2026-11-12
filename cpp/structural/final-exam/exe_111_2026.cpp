// Од стандарден влез се внесува цел број N, по што следуваат N текстуални низи (стрингови).
// За секоја од внесените низи потребно е да се направи следната трансформација:
//
// Секој број (цифра) што се појавува во стрингот да се замени со првата буква од англиското име на тој број.
//
// Пример:
//
// 1 → 'o' (one)
// 2 → 't' (two)
// 3 → 't' (three)
// 4 → 'f' (four) итн.
//
// Сите празни места (spaces) во стрингот да се отстранат.
// По извршената трансформација, добиениот стринг да се отпечати на стандарден излез.
#include <iostream>
#include <cctype>
using namespace std;

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[101];
    char ch[10] = {'z', 'o', 't', 't', 'f', 'f', 's', 's', 'e', 'n',};

    for (int i = 0; i < n; i++) {
        cin.getline(str, 101);

        int index = 0;

        for (int j = 0; str[j] != '\0'; j++) {
            if (isspace(str[j])) {
                continue;
            }

            if (isdigit(str[j])) {
                str[index++] = ch[str[j] - '0'];
            } else {
                str[index++] = str[j];
            }
        }
        str[index] = '\0';

        cout << str << endl;
    }

    return 0;
}
