/*
    Да се имплементира рекурзивна функција која за низа од цели броеви $[a{0}, a{1}, ..., a_{n-1}]$
    ќе ја пресмета вредноста на непрекинатата дропка дефинирана како:
    Да се напише програма во која се чита цел број N, по што се читаат елементите на низа од N цели броеви (не повеќе од 100).
    Потоа се повикува рекурзивната функција и се печати резултатот во нов ред.

    Input: 50 50 8 43 32 29 4 23 26 17 16 30 16 20 42 41 24 36 27 38 43 22 10 27 14 48 21 20 40 36 13 10 28 33 3 8 3 6 49 23 23 12 31 37 33 12 47 32 42 16 1
    Output: 50.1246
*/
#include <iostream>

using namespace std;

// Recursive function to calculate the continued fraction value
// index tracks our current position, and size is the total number of elements
double calculate_fraction(int array[], int index, int size) {
    // Base case: If we reach the last element, we just return its value
    if (index == size - 1) {
        return array[index];
    }

    // Recursive case: current_element + 1 / (fraction of the remaining elements)
    return array[index] + (1.0 / calculate_fraction(array, index + 1, size));
}

int main() {
    int total_elements;
    if (!(cin >> total_elements)) {
        return 0;
    }

    int numbers[100];
    for (int i = 0; i < total_elements; i++) {
        cin >> numbers[i];
    }

    // Call the recursive function starting from the first element (index 0)
    double final_result = calculate_fraction(numbers, 0, total_elements);

    // Print the result
    cout << final_result << endl;

    return 0;
}
