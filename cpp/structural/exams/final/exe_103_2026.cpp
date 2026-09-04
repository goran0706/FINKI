// TASK 1 - Even digits with recursion
//
// Write a program that reads an integer n, followed by n whole numbers
// For each number, check whether all its digits are even, using a recursive function.
// - Print all such numbers starting from the last one to the first one
// - Determine and print the position of the first and the last number (in the original order) that satisfies the condition.
#include <iostream>
using namespace std;

bool even_digits(int n) {
    if (n < 0) {
        n = -n;
    }

    if (n == 0) {
        return true;
    }

    if ((n % 10) % 2 != 0) {
        return false;
    }

    return even_digits(n / 10);
}

int main() {
    int n;
    cin >> n;

    int numbers[100];
    for (int i = 0; i < n; i++) {
        cin >> numbers[i];
    }

    int first_digit_original_order = -1;
    int last_digit_original_order = -1;

    for (int i = n - 1; i >= 0; i--) {
        if (numbers[i] == 0 || even_digits(numbers[i])) {
            cout << numbers[i] << endl;

            // Бидејќи одиме наназад, првиот пронајден е всушност ПОСЛЕДНИОТ во оригиналната низа
            if (last_digit_original_order == -1) {
                last_digit_original_order = i;
            }

            // Постојано го ажурираме 'first'.
            // Последниот што ќе го запишеме (најблиску до индекс 0) ќе биде ПРВИОТ во оригиналната низа
            first_digit_original_order = i;
        }
    }

    cout << "First number position: " << first_digit_original_order << endl;
    cout << "Last number position: " << last_digit_original_order << endl;

    return 0;
}
