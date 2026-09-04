/*
    Од стандарден влез се внесува почетна текстуална низа (стринг) со максимална должина од 20 знаци - почетен стринг.

    Потоа се внесува цел број N (N<=100), а во продолжение секоја во нов ред, се внесуваат N текстуални низи (реченици) со максимална должина од 150 знаци.

    За секоја од внесените реченици треба да се изброи колку пати почетниот стринг последователно се појавува во неа
    (треба да се прави разлика помеѓу мали и големи букви).

    На крај да се генерира извештај во кој ќе се наведе колку вкупно реченици имаат 0, 1, 2, …
    односно n последователни појавувања на почетниот стринг. Во овој случај n е бројот на последователни појавувања на почетниот стринг во речениците.
    Излезот треба да биде во форматот како што е даден во примерот.

    Забелешка: Броењето на тоа колку пати почетниот стринг последователно се наоѓа во реченицата да се направи во посебна функција.

    Кај излезот првиот број означува последователни појавувања на стрингот 2024 (од 0 до n),
    а вториот број означува кај колку реченици од влезот е соодветниот број на последователни појавувања на почетниот стринг 2024.

    На пример во реченицата:
    20242024 e novata godina koja ni pretstoi, Da bide ispolneta so radost i srekja. Srekjna Nova 202420242024 godina!

    бројот на последователно појавување на стрингот 2024 е: 3 (обележани со задебелени и подвлечени знаци).

    Input:
    2024
    4
    Srekjna Nova Godina!
    Srekjkna Nova 20242024 godina! Mnogu zdravje, uspeh i srekja vo 2024ta.
    20242024 e novata godina koja ni pretstoi, Da bide ispolneta so radost i srekja. Srekjna Nova 202420242024 godina!
    Uste edna nova godina ni dojde.

    Output:
    0: 2
    1: 1
    2: 0
    3: 1
*/
#include <cstring>
#include <iostream>
using namespace std;

int substring_count(char haystack[], char needle[]) {
    int haystack_len = strlen(haystack);
    int needle_len = strlen(needle);

    int consecutive_matches = 0;
    int consecutive_groups = 0;

    for (int i = 0; i <= haystack_len - needle_len; i++) {
        bool found = true;

        for (int j = 0; j < needle_len; j++) {
            if (haystack[i + j] != needle[j]) {
                found = false;
                break;
            }
        }

        if (found) {
            consecutive_matches++;
            i += needle_len - 1;
        } else {
            if (consecutive_matches >= 2) {
                consecutive_groups++;
            }
            consecutive_matches = 0;
        }
    }

    if (consecutive_matches >= 2) {
        consecutive_groups++;
    }

    return consecutive_groups;
}

int main() {
    char needle[20];
    cin >> needle;
    cin.ignore();

    int n;
    cin >> n;
    cin.ignore();

    int frequency[n];

    for (int i = 0; i < n; i++) {
        char haystack[150];
        cin.getline(haystack, 150);
        frequency[i] = substring_count(haystack, needle);
    }

    for (int i = 0; i < n; i++) {
        cout << i << ":" << frequency[i] << endl;
    }
}
