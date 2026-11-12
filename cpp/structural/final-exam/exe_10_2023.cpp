/*
    ============================================================
    TASK 7 — Consecutive Consonants
    ============================================================
    Се внесува N (N <= 100) и N реченици (до 100 знаци).

    За секоја реченица се одредува максималниот број на последователни согласки.

    Да се прикаже извештај:
      <број на последователни согласки>: <број на реченици>

    ЗАБЕЛЕШКА:
    Броењето мора да биде во посебна функција.
*/
#include <iostream>
using namespace std;

// Функција која го наоѓа максималниот број на последователни согласки во една реченица
int maxConsecutiveConsonants(const char *sentence) {
    int max_count = 0;
    int current_count = 0;

    for (int i = 0; sentence[i] != '\0'; i++) {
        char ch = tolower(sentence[i]);

        // Проверка дали карактерот е буква и дали е согласка
        if (isalpha(ch) && ch != 'a' && ch != 'e' && ch != 'i' && ch != 'o' && ch != 'u') {
            current_count++;
            if (current_count > max_count) {
                max_count = current_count;
            }
        } else {
            current_count = 0; // Прекин на низата од согласки
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

        int consecutive = maxConsecutiveConsonants(sentence);
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
