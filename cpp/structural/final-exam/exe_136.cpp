/*
    Од тастатура се внесуваат димензиите на една матрица (m, n <= 100), а потоа и елементите од матрицата.
    Да се генерира низа (со најмногу m) така што секој елемент од низата се добива со наоѓање на елементот
    во секоја редица од матрицата што е најоддалечен од аритметичката средина во рамки на таа редица.
    Ако постојат повеќе елементи што се најоддалечени од аритметичката средина, тогаш се зема предвид првиот.
    Редоследот на запишување на елементите во низата одговара на редоследот на редиците.

    Пример:

    Влез:
    3 6
    1 2 2 3 4 5
    1 1 2 2 3 3
    1 2 3 4 5 6

    Излез:
    5 1 1
*/
#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;

int main() {
    int m, n;
    if (!(cin >> m >> n)) return 0;

    int a[100][100];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }

    int rez[100];

    for (int i = 0; i < m; i++) {
        // Чекор 1) Пресметка на збир
        int sum = 0;
        for (int j = 0; j < n; j++) {
            sum += a[i][j];
        }

        // Чекор 2) Пресметка на аритметичка средина (мора да е double)
        double avg = static_cast<double>(sum) / n;

        // Чекор 3) Наоѓање на најоддалечениот (го поставуваме првиот како почетен максумим)
        double max_diff = abs(a[i][0] - avg);
        int max_element = a[i][0];

        for (int j = 1; j < n; j++) {
            double curr_diff = abs(a[i][j] - avg);
            if (curr_diff > max_diff) {
                max_diff = curr_diff;
                max_element = a[i][j];
            }
        }

        rez[i] = max_element;
    }

    for (int i = 0; i < m; i++) {
        cout << rez[i] << " ";
    }
    cout << endl;

    return 0;
}
