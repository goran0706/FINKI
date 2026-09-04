// Од тастатура се внесува даден природен број N и после него се внесуваат N други природни броеви кои се од податочен тип long.
// За секој од внесените броеви да се определи дали истиот претставува репрезентација на збор и
// да се испечати буквата со најголем ASCII код (тоа е буквата најблиску до буквата Z).
// Зборот е составен од било кои големи букви и има најмалку 3 букви.
// Проверката на тоа дали бројот е репрезентација на збор, да се направи во посебна функција.
// ASCII кодот на првата голема буква 'А' е 65, а на последната голема буква 'Z' е 90
//
// Пример:
// 5
// 8380 не е репрезенатција на збор, зошто има 2 букви
// 84698384 е репрезенатција на зборот TEST (ASCII кодот за буквата T е 84, за E е 69 и за S е 83) со најголема буква T
// 7383808390 е репрезенатција на зборот ISPIZ, со најголема буква Z
// 108380 не е репрезентација на збор, зошто не е составен од сите букви
// 83800 не е репрезентација на збор

#include <iostream>
using namespace std;

bool is_word(long n);

char largest_ascii(long n);

void print_word(long n);

int main() {
    int n;
    cin >> n;

    for (int i = 0; i < n; i++) {
        long num;
        cin >> num;

        if (is_word(num)) {
            cout << num << " represents a word: ";
            print_word(num);
            cout << largest_ascii(num) << " is the largest letter." << endl;
        } else {
            cout << num << " does not represent a word." << endl;
        }
    }

    return 0;
}

bool is_word(long n) {
    int letter_counter = 0;

    while (n > 0) {
        if (!isalpha(n % 100)) {
            return false;
        }

        letter_counter++;
        n /= 100;
    }

    return letter_counter >= 3;
}

char largest_ascii(long n) {
    char largest = 0;

    while (n > 0) {
        char last_two = n % 100;

        if (last_two > largest) {
            largest = last_two;
        }

        n /= 100;
    }

    return largest;
}

void print_word(long n) {
    long reversed = 0;

    while (n > 0) {
        reversed = reversed * 100 + n % 100;
        n /= 100;
    }

    while (reversed > 0) {
        cout << char(reversed % 100);
        reversed /= 100;
    }

    cout << endl;
}
