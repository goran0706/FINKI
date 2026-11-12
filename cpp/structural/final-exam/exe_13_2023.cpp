/*
    ============================================================
    TASK 10 — Consecutive Vowels
    ============================================================
    Аналогно на TASK 7, но се бројат самогласки.

    Да се прикаже извештај за максимален број на последователни самогласки по реченица.
*/
#include <iostream>
using namespace std;

int maxConsecutiveVowels(const char *sentence) {
    int max_count = 0;
    int current_count = 0;

    for (int i = 0; sentence[i] != '\0'; i++) {
        char ch = tolower(sentence[i]);

        if (isalpha(ch) && (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u')) {
            current_count++;
            if (current_count > max_count) {
                max_count = current_count;
            }
        } else {
            current_count = 0;
        }
    }

    return max_count;
}

int main() {
    int n;
    cin >> n;
    cin.ignore(); // Се чисти делителот (newline) по внесувањето на N

    // Фреквентна низа за извештајот. Бидејќи реченицата има макс 100 знаци,
    // максималниот број на согласки не може да биде поголем од 100.
    int report[101] = {0};

    // Низа за чување на моменталната реченица
    char sentence[101];

    for (int i = 0; i < n; i++) {
        cin.getline(sentence, 101);
        int consecutive = maxConsecutiveVowels(sentence);
        report[consecutive]++;
    }

    // Прикажување на извештајот
    for (int i = 0; i <= 100; i++) {
        if (report[i] > 0) {
            cout << i << ": " << report[i] << endl;
        }
    }

    return 0;
}
