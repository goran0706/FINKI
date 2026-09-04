/*
    ============================================================
    TASK 1 — String Occurrences (Case-Sensitive)
    ============================================================
    Од стандарден влез се внесува почетна текстуална низа (стринг) со максимална должина од 20 знаци.

    Потоа се внесува цел број N (N <= 100), по што следат N текстуални низи (реченици), секоја во нов ред,
    со максимална должина од 100 знаци.

    За секоја реченица да се изброи колку вкупно пати почетниот стринг се појавува во неа
    (се прави разлика помеѓу мали и големи букви).

    На крај да се генерира извештај кој прикажува колку реченици имаат 0, 1, 2, …, n појавувања на почетниот стринг,
    каде n е максималниот број на појавувања во една реченица.

    ЗАБЕЛЕШКА:
    Броењето на појавувањата мора да биде имплементирано во посебна функција.

    Излезен формат:
    <број на појавувања>: <број на реченици>

    Input:
      2024
      4
      Srekjna Nova Godina!
      Srekjkna Nova 2024 godina! Mnogu zdravje, uspeh i srekja vo 2024ta.
      2024 e novata godina koja ni pretstoi, ... Srekjna 2024 godina!
      Uste edna nova godina ni dojde.

    Output:
      0: 2
      1: 0
      2: 2
*/
#include <cstring>
#include <iostream>
using namespace std;

// Функција која го наоѓа ВКУПНИОТ број на појавувања на таргет стрингот во реченицата (Case-Sensitive)
int countStringOccurrences(const char *sentence, const char *target) {
    int target_len = strlen(target);
    int sentence_len = strlen(sentence);

    // Ако таргетот е подолг од реченицата или празен
    if (target_len == 0 || target_len > sentence_len) {
        return 0;
    }

    int count = 0;

    // Ја изминуваме реченицата карактер по карактер
    for (int i = 0; i <= sentence_len - target_len; i++) {
        // strncmp прави разлика помеѓу мали и големи букви (Case-Sensitive)
        if (strncmp(&sentence[i], target, target_len) == 0) {
            count++;
            // Забелешка: i се зголемува за 1 од самата for-циклус јамка,
            // што овозможува да се фатат и преклопени појавувања ако постојат.
        }
    }

    return count;
}

int main() {
    char target[21];
    cin >> target; // Внесување на бараниот стринг (макс 20 знаци)

    int n;
    cin >> n;
    cin.ignore(); // Чистење на баферот од преостанатиот знак за нов ред (\n)

    // Фреквентна низа за извештајот. Максимум појавувања во 100 знаци е 100.
    int report[101] = {0};
    int max_occurrences_found = 0; // Ја следи горната граница за извештајот

    char sentence[101];
    for (int i = 0; i < n; i++) {
        cin.getline(sentence, 101);

        int occurrences = countStringOccurrences(sentence, target);
        report[occurrences]++;

        // Го ажурираме максимумот за финалното печатење
        if (occurrences > max_occurrences_found) {
            max_occurrences_found = occurrences;
        }
    }

    // Прикажување на извештајот од 0 до максималниот број на појавувања (n)
    for (int i = 0; i <= max_occurrences_found; i++) {
        cout << i << ": " << report[i] << endl;
    }

    return 0;
}
