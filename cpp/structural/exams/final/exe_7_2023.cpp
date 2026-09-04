/*
  ============================================================
  TASK 4 — Consecutive String Occurrences
  ============================================================
  Се внесува почетен стринг (до 20 знаци), потоа N (N <= 100), и N реченици со должина до 150 знаци.
  За секоја реченица да се одреди колку пати почетниот стринг се појавува ПОСЛЕДОВАТЕЛНО.

  Да се генерира извештај:
    <број на последователни појавувања>: <број на реченици>

  ЗАБЕЛЕШКА:
  Броењето мора да биде во посебна функција.

  Пример:
    202420242024 → 3 последователни појавувања

  Output:
    0: 2
    1: 1
    2: 0
    3: 1
*/
#include <cstring>
#include <iostream>
using namespace std;

// Функција која го наоѓа максималниот број на ПОСЛЕДОВАТЕЛНИ појавувања на таргет стрингот во реченицата
int maxConsecutiveOccurrences(const char *sentence, const char *target) {
    int target_len = strlen(target);
    int sentence_len = strlen(sentence);

    // Ако таргетот е подолг од реченицата или е празен, нема појавувања
    if (target_len == 0 || target_len > sentence_len) {
        return 0;
    }

    int max_consecutive = 0;
    int current_consecutive = 0;

    int i = 0;

    while (i <= sentence_len - target_len) {
        // Проверка дали на позиција i се наоѓа таргет стрингот
        if (strncmp(&sentence[i], target, target_len) == 0) {
            current_consecutive++;
            if (current_consecutive > max_consecutive) {
                max_consecutive = current_consecutive;
            }
            // Бидејќи најдовме совпаѓање, скокаме напред за должината на таргетот
            i += target_len;
        } else {
            // Ако низата се прекине, го ресетираме моменталниот бројач
            current_consecutive = 0;
            // Се поместуваме само за 1 карактер напред за да бараме нов почеток
            i++;
        }
    }

    return max_consecutive;
}

int main() {
    char target[21];
    cin >> target;

    int n;
    cin >> n;
    cin.ignore(); // Чистење на \n баферот по внесувањето на N

    // Фреквентна низа за извештајот. Максималниот можен број на последователни
    // појавувања во реченица од 150 знаци (ако таргетот е мин. 1 знак) е 150.
    int report[151] = {0};
    int max_found_consecutive = 0; // Чува трага до каде треба да печатиме во извештајот

    char sentence[151];

    for (int i = 0; i < n; i++) {
        cin.getline(sentence, 151);

        int consecutive = maxConsecutiveOccurrences(sentence, target);
        report[consecutive]++;

        // Го ажурираме максимумот за да знаеме до каде да го печатиме извештајот
        if (consecutive > max_found_consecutive) {
            max_found_consecutive = consecutive;
        }
    }

    // Прикажување на извештајот (од 0 до најголемиот пронајден број на последователни појавувања)
    for (int i = 0; i <= max_found_consecutive; i++) {
        cout << i << ": " << report[i] << endl;
    }

    return 0;
}
