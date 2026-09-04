/*
    Од стандарден влез се внесува почетна тексутуална низа (стринг) со максимална должина од 20 знаци - почетен стринг.

    Потоа се внесува цел број N (N<=100), а во продолжение секоја во нов ред,
    се внесуваат N текстуални низи (реченици) со максимална должина од 100 знаци.

    За секоја од внесените реченици треба да се изброи колку вкупно пати почетниот стринг се појавува во неа
    (треба  да се прави разлика помеѓу мали и големи букви).

    На крај да се генерира извештај во кој ќе се наведе колку вкупно реченици имаат 0, 1, 2, … односно n појавувања на почетниот стринг.
    Во овој случај n е бројот на појавувања на почетниот стринг во некоја од речениците.
    Излезот треба да биде во форматот како што е даден во примерот.

    Забелешка: Броењето на тоа колку пати почетниот стринг се наоѓа во реченицата да се направи во посебна функција.
    Кај излезот првиот број означува појавувања на стрингот 2024 (од 0 до n),
    а вториот број означува кај колку реченици од влезот е соодветниот број на појавувања на почетниот стринг 2024.

    Input:
    2024
    4
    Srekjna Nova Godina!
    Srekjkna Nova 2024 godina! Mnogu zdravje, uspeh i srekja vo 2024ta.
    2024 e novata godina koja ni pretstoi, Da bide ispolneta so radost i srekja. Srekjna 2024 godina!
    Uste edna nova godina ni dojde.

    Output:
    0: 0
    1: 2
    2: 2
    3: 0
*/

#include <cstring>
#include <iostream>
using namespace std;

int substring_count(char haystack[], char needle[]) {
    int haystack_len = strlen(haystack);
    int needle_len = strlen(needle);

    int count = 0;

    for (int i = 0; i < haystack_len; i++) {
        bool found = true;

        for (int j = 0; j < needle_len; j++) {
            if (haystack[i + j] != needle[j]) {
                found = false;
                break;
            }
        }

        if (found) {
            count++;
        }
    }

    return count;
}

int main() {
    char needle[20];
    cin >> needle;
    cin.ignore();

    int n;
    cin >> n;
    cin.ignore();

    int frequency[n];
    char haystack[100];

    for (int i = 0; i < n; i++) {
        cin.getline(haystack, 100);
        frequency[i] = substring_count(haystack, needle);
    }

    for (int i = 0; i < n; i++) {
        cout << i << ":" << frequency[i] << endl;
    }
}
