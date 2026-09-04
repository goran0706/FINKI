/*
    Од стандарден влез се внесува цел број N (N<=100), а потоа се внесуваат N текстуални низи (реченици)
    со максимална должина од 100 знаци, секоја зададена во нов ред.

    За секоја од внесените реченици треба да се изброи колку вкупно пати последователно се појавуваат согласки.
    На крај да се генерира извештај во кој ќе се наведе колку вкупно реченици имаат 0, 1, 2, …
    односно n појaвувања на последователни согласки.
    Во овој случај n е максималниот број на последователни појавувања на согласки во некоја од речениците.

    Излезот треба да биде во форматот како што е даден во примерот.
    Забелешка: Броењето на последователни појавувања на согласки во реченицата  да се направи во посебна функција.

    Кај излезот првиот број ги значува последователните појавувања на согласките (0 до n),
    а вториот број означува кај колку реченици од влезот е соодветниот број на последователни повторувања на согласки.

    На пример во реченицата:

    Uste edna nova godina ni dojde.

    бројот на последователно појавување согласки е: 3 (обележани со задебелени букви).

    Input:
    4
    Srekjna Nova Godina!
    2024 e novata godina koja ni pretstoi, Da bide ispolneta so radost i srekja.
    Uste edna nova godina ni dojde.
    2024taaaaa

    output:
    0: 1
    1: 0
    2: 1
    3: 1
    4: 0
    5: 0
    6: 0
    7: 1
*/
#include <iostream>
using namespace std;

bool isVowel(char c) {
    c = tolower(c);
    return (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u');
}

bool is_letter(char c) {
    return isalpha(c);
}

int max_consonants_count(char str[]) {
    int max = 0;
    int count = 0;

    for (int i = 0; str[i] != '\0'; i++) {
        if (is_letter(str[i]) && !isVowel(str[i])) {
            count++;
            if (count > max) max = count;
        } else {
            count = 0;
        }
    }

    return max;
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    int frequency[n];
    char str[100];

    for (int i = 0; i < n; i++) {
        cin.getline(str, 100);
        frequency[i] = max_consonants_count(str);
    }

    for (int i = 0; i < n; i++) {
        cout << i << ":" << frequency[i] << endl;
    }
}
