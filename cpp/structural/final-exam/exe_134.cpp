/*
    Од стандарден влез се чита ливче во спортска обложувалница.
    Во првиот ред е запишана сумата на уплата (цел број).
    Потоа во секој нареден ред кој се чита од стандарден влез (се додека не се прочита знакот #) е запишан по еден тип во следниот формат:

    ab12 1 1.25

    Првиот број е шифрата на типот (низа од знаци која не е подолга од 9 знаци),
    вториот број е типот (може да биде 1, 0 или 2) додека
    третиот број е коефициентот (реален број).

    Ваша задача е да го испечатите типот со најголем коефициент како и можната добивка на ливчето.
    Доколку има повеќе типови со ист максимален коефициент, да се испечати првиот.

    Можната добивка се пресметува како производ на сите коефициенти со сумата на уплата.

    Input:
    100
    ab12 1 1.2
    c234 2 2.0
    #

    Output:
    c234 2 2
    240
*/
#include <iostream>
#include <cstring>

using namespace std;

int main() {
    int payment;
    if (!(cin >> payment)) {
        return 0;
    }

    char code[10];
    char max_code[10] = "";

    int tip = 0;
    int max_tip = 0;

    double coefficient;
    double max_coefficient = -1.0;
    double total_coefficient = 1.0;

    while (cin >> code) {
        if (strcmp(code, "#") == 0) {
            break;
        }

        cin >> tip >> coefficient;
        total_coefficient *= coefficient;

        if (coefficient > max_coefficient) {
            max_coefficient = coefficient;
            strcpy(max_code, code);
            max_tip = tip;
        }
    }

    double total_winning = payment * total_coefficient;
    cout << max_code << " " << max_tip << " " << max_coefficient << endl;
    cout << total_winning << endl;

    return 0;
}
