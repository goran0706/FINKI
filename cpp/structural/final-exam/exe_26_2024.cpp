/*
    ============================================================
    TASK 11
    ============================================================
    За секој ред да се испечати бројот на цифри, знакот ':' и самите цифри сортирани по ASCII.
*/
#include <cstring>
#include <iostream>
using namespace std;

void selectionSort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i; // Претпоставуваме дека тековниот е најмал

        // Бараме дали има помал елемент десно од него
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j; // Го зачувуваме индексот на новиот најмал елемент
            }
        }

        // Правиме замена само еднаш, откако ќе го најдеме вистинскиот минимум
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}

void bubbleSort(char *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false; // Ресетирај го знаменцето за секој нов премин

        // Внатрешниот циклус ги споредува СОСЕДИТЕ.
        // Со секој изминат премин (i), последните i елементи се веќе на место, па затоа одиме до n - i - 1
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true; // Се случи замена!
            }
        }

        // Ако не се случила ниту една замена во целиот премин, низата е готова
        if (!swapped) {
            break;
        }
    }
}

int main() {
    int n;
    cin >> n;
    cin.ignore();

    char str[101];

    for (int i = 0; i < n; i++) {
        cin.getline(str, 101);

        char digits[101];
        int digit_count = 0;

        const int len = strlen(str);

        for (int j = 0; j < len; j++) {
            if (isdigit(str[j])) {
                digits[digit_count] = str[j];
                digit_count++;
            }
        }

        digits[digit_count] = '\0';

        bubbleSort(digits, digit_count);

        cout << digit_count << ":" << digits << endl;
    }

    return 0;
}
