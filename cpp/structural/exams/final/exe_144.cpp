/*
    За еден природен број а велиме дека е порамнување на друг природен број b
    ако и само ако цифрите еднакви на 9 во бројот b се заменети со цифрата 7 во бројот а.

    Пример. Бројот 734775 е порамнување на бројот 934795.

    Од стандарден влез се внесуваат непознат број на цели броеви (не повеќе од 100),
    се додека не се внесе нешто што не може да се интерпретира како цел број.

    Ваша задача е да ги отпечатите најмалите 5 од порамнувањата на сите внесени броеви, по редослед од најмалиот кон најголемиот.

    Забелешка: Доколку се внесат помалку од 5 броеви, тогаш печатите толку броеви колку што се соодветно внесени.

    Наоѓањето на порамнувањето на даден број треба да се реализира во посебна рекурзивна функција poramnet(int a).

    Пример.

    За броевите: 9592, 69403, 100007, 6, 987, 6977, 33439,
    треба да се најдат нивните порамнувања ( тоа се: 7572, 67403, 100007, 6, 787, 6777 и 33437, соодветно),
    и да се отпечатат најмалите 5 од нив по овој редослед: 6 787 6777 7572 33437.

    ЗАБРАНЕТО е користење на глобални променливи.

    Input:
    5
    6
    8
    9
    9
    9
    9
    y

    Output:
    5 6 7 7 7
*/
#include <iostream>
using namespace std;

// ==========================================
// SOLUTION 1: TRANSFORM & REVERSE
// ==========================================
int reverseNumber(int n) {
    int reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return reversed;
}

int transformAndReverse(int n) {
    if (n == 0) return 0;

    int transformed = 0;
    while (n > 0) {
        int digit = n % 10;
        if (digit == 9) {
            digit = 7;
        }
        transformed = transformed * 10 + digit;
        n /= 10;
    }
    return reverseNumber(transformed);
}

// ==========================================
// SOLUTION 2: IN-PLACE LOOP (USING PLACE VALUE)
// ==========================================
int transformInPlace(int n) {
    int result = 0;
    int multiplier = 1;

    while (n > 0) {
        int digit = n % 10;
        if (digit == 9) {
            digit = 7;
        }
        result += digit * multiplier;
        multiplier *= 10;
        n /= 10;
    }
    return result;
}

// ==========================================
// SOLUTION 3: RECURSION
// ==========================================
int transformRecursively(int n) {
    if (n == 0) {
        return 0;
    }

    int lastDigit = n % 10;
    if (lastDigit == 9) {
        lastDigit = 7;
    }

    return transformRecursively(n / 10) * 10 + lastDigit;
}

// ==========================================
// SORTING UTILITY
// ==========================================
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// ==========================================
// MAIN EXECUTION (RUNNING RECURSION)
// ==========================================
int main() {
    int numbers[100];
    int n = 0;
    int tmp;

    while (cin >> tmp) {
        if (tmp == 0) {
            numbers[n++] = 0;
        } else {
            numbers[n++] = transformRecursively(tmp);
        }
    }

    bubbleSort(numbers, n);

    int limit = (n < 5) ? n : 5;
    for (int i = 0; i < limit; i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;

    return 0;
}
