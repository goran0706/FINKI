/*
 * СТРУКТУРНО ПРОГРАМИРАЊЕ - ПРАКТИЧНИ ЗАДАЧИ
 * Structural Programming - Practice Exercises
 *
 * Instructions:
 * 1. Uncomment ONE exercise at a time in main()
 * 2. Implement the solution in the function body
 * 3. Test with the provided example inputs
 * 4. Move to the next exercise
 *
 * Compile in CLion: g++ -o exercises exercises.cpp
 */

#include <iostream>
#include <cmath>
#include <cstring>
#include <cctype>
using namespace std;

// ============================================================================
// 1. МАНИПУЛАЦИЈА СО БРОЕВИ (Number Manipulation)
// ============================================================================

/*
 * ЗАДАЧА 1.1: Додавање цифра на крај од број
 * Add a digit to the end of a number
 *
 * Example:
 * Input: number = 123, digit = 4
 * Output: 1234
 *
 * Hint: result = number * 10 + digit
 */
void exercise_1_1() {
    int number, digit;
    cout << "Enter number: ";
    cin >> number;
    cout << "Enter digit to add at end: ";
    cin >> digit;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.2: Земање на последна цифра
 * Get the last digit of a number
 *
 * Example:
 * Input: 12345
 * Output: 5
 *
 * Hint: Use modulo operator %
 */
void exercise_1_2() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.3: Додавање цифра на почеток
 * Add a digit to the beginning of a number
 *
 * Example:
 * Input: number = 234, digit = 1
 * Output: 1234
 *
 * Hint: Count digits first, then multiply digit by 10^count
 */
void exercise_1_3() {
    int number, digit;
    cout << "Enter number: ";
    cin >> number;
    cout << "Enter digit to add at beginning: ";
    cin >> digit;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.4: Бришење на последна цифра
 * Remove the last digit from a number
 *
 * Example:
 * Input: 12345
 * Output: 1234
 *
 * Hint: Use division operator /
 */
void exercise_1_4() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.5: Бришење на цифра од почеток
 * Remove the first digit from a number
 *
 * Example:
 * Input: 12345
 * Output: 2345
 *
 * Hint: Count total digits, find power of 10, use modulo
 */
void exercise_1_5() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.6: Проверка за палиндром
 * Check if a number is a palindrome
 *
 * Example:
 * Input: 12321
 * Output: true/Да
 *
 * Hint: Reverse the number and compare with original
 * ВАЖНО: Use tmp variable to preserve original number!
 */
void exercise_1_6() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.7: Наоѓање број на цифри
 * Count the number of digits in a number
 *
 * Example:
 * Input: 12345
 * Output: 5
 *
 * Hint: Keep dividing by 10 until number becomes 0
 */
void exercise_1_7() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.8: Збир на цифри
 * Calculate the sum of all digits
 *
 * Example:
 * Input: 12345
 * Output: 15 (1+2+3+4+5)
 *
 * Hint: Extract each digit using %, add to sum, divide by 10
 */
void exercise_1_8() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.9: Производ на цифри
 * Calculate the product of all digits
 *
 * Example:
 * Input: 234
 * Output: 24 (2*3*4)
 */
void exercise_1_9() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 1.10: Реверзирање на број
 * Reverse a number
 *
 * Example:
 * Input: 12345
 * Output: 54321
 */
void exercise_1_10() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

// ============================================================================
// 2. НИЗИ (Arrays)
// ============================================================================

/*
 * ЗАДАЧА 2.1: Наоѓање на минимум и максимум
 * Find minimum and maximum in an array
 *
 * Example:
 * Input: n=5, elements: 5 2 8 1 9
 * Output: min = 1, max = 9
 *
 * ВАЖНО: Initialize min = niza[0] and max = niza[0], NOT 0!
 */
void exercise_2_1() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.2: Наоѓање на втор минимум и максимум
 * Find second minimum and second maximum
 *
 * Example:
 * Input: n=5, elements: 5 2 8 1 9
 * Output: second_min = 2, second_max = 8
 */
void exercise_2_2() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.3: Бришење на елемент од даден индекс
 * Delete element at given index
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5, index=2
 * Output: 1 2 4 5
 *
 * Hint: Shift all elements after index to the left
 */
void exercise_2_3() {
    int n, index;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    cout << "Enter index to delete: ";
    cin >> index;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.4: Вметнување елемент на даден индекс
 * Insert element at given index
 *
 * Example:
 * Input: n=5, elements: 1 2 4 5 6, index=2, value=3
 * Output: 1 2 3 4 5 6
 *
 * Hint: Shift elements right from index, then insert
 */
void exercise_2_4() {
    int n, index, value;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    cout << "Enter index: ";
    cin >> index;
    cout << "Enter value to insert: ";
    cin >> value;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.5: Поместување на елементи за k места во десно (циклично)
 * Shift array elements k positions to the right (circular rotation)
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5, k=2
 * Output: 4 5 1 2 3
 *
 * Hint: Use temporary array or reverse algorithm
 */
void exercise_2_5() {
    int n, k;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    cout << "Enter k (positions to shift right): ";
    cin >> k;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.6: Поместување на елементи за k места во лево (циклично)
 * Shift array elements k positions to the left (circular rotation)
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5, k=2
 * Output: 3 4 5 1 2
 */
void exercise_2_6() {
    int n, k;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    cout << "Enter k (positions to shift left): ";
    cin >> k;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.7: Bubble Sort
 * Sort array using bubble sort algorithm
 *
 * Example:
 * Input: n=5, elements: 5 2 8 1 9
 * Output: 1 2 5 8 9
 */
void exercise_2_7() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Implement bubble sort
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (niza[i] > niza[j]) {
                int temp = niza[i];
                niza[i] = niza[j];
                niza[j] = temp;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << niza[i];
    }
}

/*
 * ЗАДАЧА 2.8: Реверзирање на низа
 * Reverse an array
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5
 * Output: 5 4 3 2 1
 */
void exercise_2_8() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.9: Проверка дали низата е сортирана
 * Check if array is sorted (ascending)
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5
 * Output: true/Да
 */
void exercise_2_9() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 2.10: Пребарување елемент (Linear Search)
 * Search for an element in array
 *
 * Example:
 * Input: n=5, elements: 1 2 3 4 5, search=3
 * Output: Found at index 2
 */
void exercise_2_10() {
    int n, search;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    cout << "Enter element to search: ";
    cin >> search;

    // TODO: Your code here
}

// ============================================================================
// 3. МАТРИЦИ (Matrices)
// ============================================================================

/*
 * ЗАДАЧА 3.1: Поставување вредности на главна дијагонала
 * Set main diagonal elements to a specific value (7)
 *
 * Example:
 * Input: n=3, matrix elements
 * Output: All mat[i][i] = 7
 *
 * Hint: Main diagonal when i == j
 */
void exercise_3_1() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.2: Збир на главна дијагонала
 * Calculate sum of main diagonal
 *
 * Example:
 * Input: 3x3 matrix
 * Output: sum of mat[0][0] + mat[1][1] + mat[2][2]
 */
void exercise_3_2() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.3: Збир на споредна дијагонала
 * Calculate sum of secondary diagonal
 *
 * Example:
 * Input: 3x3 matrix
 * Output: sum where i + j = n - 1
 *
 * Hint: Secondary diagonal when i + j == n - 1
 */
void exercise_3_3() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.4: Збир на елементи над главна дијагонала
 * Sum of elements above main diagonal
 *
 * Example:
 * Input: matrix
 * Output: sum where i < j
 */
void exercise_3_4() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.5: Збир на елементи под главна дијагонала
 * Sum of elements below main diagonal
 *
 * Example:
 * Input: matrix
 * Output: sum where i > j
 */
void exercise_3_5() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.6: Проверка за симетричност во однос на главна дијагонала
 * Check if matrix is symmetric with respect to main diagonal
 *
 * Example:
 * Input: matrix
 * Output: true if mat[i][j] == mat[j][i] for all i, j
 */
void exercise_3_6() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.7: Проверка за симетричност во однос на споредна дијагонала
 * Check if matrix is symmetric with respect to secondary diagonal
 *
 * Example:
 * Input: matrix
 * Output: true if mat[i][j] == mat[n-1-j][n-1-i] for all i, j
 */
void exercise_3_7() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.8: Транспонирање на матрица
 * Transpose a matrix
 *
 * Example:
 * Input: n x m matrix
 * Output: m x n matrix where result[j][i] = original[i][j]
 */
void exercise_3_8() {
    int n, m;
    cout << "Enter dimensions (n m): ";
    cin >> n >> m;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.9: Собирање на две матрици
 * Add two matrices
 *
 * Example:
 * Input: Two n x m matrices
 * Output: result[i][j] = mat1[i][j] + mat2[i][j]
 */
void exercise_3_9() {
    int n, m;
    cout << "Enter dimensions (n m): ";
    cin >> m >> m;
    int mat1[10][10], mat2[10][10];

    cout << "Enter first matrix:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> mat1[i][j];
        }
    }

    cout << "Enter second matrix:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> mat2[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 3.10: Множење на матрица со скалар
 * Multiply matrix by scalar
 *
 * Example:
 * Input: matrix, scalar=2
 * Output: all elements multiplied by 2
 */
void exercise_3_10() {
    int n, m, scalar;
    cout << "Enter dimensions (n m): ";
    cin >> n >> m;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> mat[i][j];
        }
    }

    cout << "Enter scalar: ";
    cin >> scalar;

    // TODO: Your code here
}

// ============================================================================
// 4. СТРИНГОВИ И КАРАКТЕРИ (Strings and Characters)
// ============================================================================

/*
 * ЗАДАЧА 4.1: ASCII вредност на карактер
 * Get ASCII value of a character
 *
 * Example:
 * Input: 'A'
 * Output: 65
 *
 * Hint: Cast character to int
 */
void exercise_4_1() {
    char ch;
    cout << "Enter character: ";
    cin >> ch;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.2: Конверзија од ASCII во карактер
 * Convert ASCII value to character
 *
 * Example:
 * Input: 65
 * Output: 'A'
 */
void exercise_4_2() {
    int ascii;
    cout << "Enter ASCII value: ";
    cin >> ascii;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.3: Должина на стринг (мануелно)
 * Calculate string length manually (without strlen)
 *
 * Example:
 * Input: "Hello"
 * Output: 5
 */
void exercise_4_3() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Calculate length manually using loop
}

/*
 * ЗАДАЧА 4.4: Споредување на стрингови (мануелно)
 * Compare two strings manually (without strcmp)
 *
 * Example:
 * Input: "abc" and "abc"
 * Output: Equal
 */
void exercise_4_4() {
    char str1[100], str2[100];
    cout << "Enter first string: ";
    cin.ignore();
    cin.getline(str1, 100);
    cout << "Enter second string: ";
    cin.getline(str2, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.5: Копирање на стринг (мануелно)
 * Copy string manually (without strcpy)
 *
 * Example:
 * Input: "Hello"
 * Output: Copied to destination
 */
void exercise_4_5() {
    char src[100], dest[100];
    cout << "Enter source string: ";
    cin.ignore();
    cin.getline(src, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.6: Конверзија во големи букви
 * Convert string to uppercase
 *
 * Example:
 * Input: "Hello World"
 * Output: "HELLO WORLD"
 *
 * Hint: Use toupper() or manual conversion with ASCII
 */
void exercise_4_6() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.7: Конверзија во мали букви
 * Convert string to lowercase
 *
 * Example:
 * Input: "Hello World"
 * Output: "hello world"
 */
void exercise_4_7() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.8: Број на зборови во реченица
 * Count words in a sentence
 *
 * Example:
 * Input: "Hello world from C++"
 * Output: 4
 *
 * Hint: Count transitions from space to non-space
 */
void exercise_4_8() {
    char str[100];
    cout << "Enter sentence: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.9: Број на самогласки
 * Count vowels in a string
 *
 * Example:
 * Input: "Hello World"
 * Output: 3 (e, o, o)
 */
void exercise_4_9() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.10: Број на согласки
 * Count consonants in a string
 *
 * Example:
 * Input: "Hello"
 * Output: 3 (H, l, l)
 */
void exercise_4_10() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.11: Палиндром стринг
 * Check if string is palindrome
 *
 * Example:
 * Input: "radar"
 * Output: true/Да
 */
void exercise_4_11() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.12: Реверзирање на стринг
 * Reverse a string
 *
 * Example:
 * Input: "Hello"
 * Output: "olleH"
 */
void exercise_4_12() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.13: Поместување на букви (Caesar Cipher)
 * Shift letters by k positions in alphabet
 *
 * Example:
 * Input: "ABC", k=3
 * Output: "DEF"
 *
 * Hint: Handle wrap-around ('Z' + 1 = 'A')
 */
void exercise_4_13() {
    char str[100];
    int k;
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);
    cout << "Enter shift value k: ";
    cin >> k;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.14: Бришење на празни места
 * Remove all spaces from string
 *
 * Example:
 * Input: "Hello World"
 * Output: "HelloWorld"
 */
void exercise_4_14() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 4.15: Проверка за анаграм
 * Check if two strings are anagrams
 *
 * Example:
 * Input: "listen" and "silent"
 * Output: true/Да
 *
 * Hint: Sort both strings and compare, or use frequency counting
 */
void exercise_4_15() {
    char str1[100], str2[100];
    cout << "Enter first string: ";
    cin.ignore();
    cin.getline(str1, 100);
    cout << "Enter second string: ";
    cin.getline(str2, 100);

    // TODO: Your code here
}

// ============================================================================
// 5. КОМПЛЕКСНИ ЗАДАЧИ (Complex Combined Exercises)
// ============================================================================

/*
 * ЗАДАЧА 5.1: Фреквенција на цифри
 * Count frequency of each digit in a number
 *
 * Example:
 * Input: 112233
 * Output:
 *   Digit 1: 2 times
 *   Digit 2: 2 times
 *   Digit 3: 2 times
 *
 * Hint: Use array of size 10 to count each digit (0-9)
 */
void exercise_5_1() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.2: Најдолг возрастечки подниз
 * Find length of longest increasing subarray
 *
 * Example:
 * Input: [1, 2, 3, 2, 3, 4, 5]
 * Output: 4 (sequence: 2, 3, 4, 5)
 */
void exercise_5_2() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    int niza[100];

    cout << "Enter elements: ";
    for (int i = 0; i < n; i++) {
        cin >> niza[i];
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.3: Ротирање на матрица за 90 степени
 * Rotate matrix 90 degrees clockwise
 *
 * Example:
 * Input:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 * Output:
 *   7 4 1
 *   8 5 2
 *   9 6 3
 *
 * Hint: new[j][n-1-i] = old[i][j]
 */
void exercise_5_3() {
    int n;
    cout << "Enter matrix dimension (n x n): ";
    cin >> n;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.4: Најдолг заеднички префикс
 * Find longest common prefix of array of strings
 *
 * Example:
 * Input: ["flower", "flow", "flight"]
 * Output: "fl"
 */
void exercise_5_4() {
    int n;
    cout << "Enter number of strings: ";
    cin >> n;
    cin.ignore();

    char strings[10][100];
    cout << "Enter strings:\n";
    for (int i = 0; i < n; i++) {
        cin.getline(strings[i], 100);
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.5: Фреквенција на карактери
 * Count frequency of each character in string (case-insensitive)
 *
 * Example:
 * Input: "Hello World"
 * Output:
 *   h: 1
 *   e: 1
 *   l: 3
 *   o: 2
 *   ...
 */
void exercise_5_5() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.6: Перфектен број
 * Check if a number is perfect (sum of divisors = number)
 *
 * Example:
 * Input: 6
 * Output: true (1 + 2 + 3 = 6)
 */
void exercise_5_6() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.7: Армстронгов број
 * Check if number is Armstrong number
 *
 * Example:
 * Input: 153
 * Output: true (1³ + 5³ + 3³ = 153)
 */
void exercise_5_7() {
    int number;
    cout << "Enter number: ";
    cin >> number;

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.8: Спирална матрица
 * Print matrix in spiral order
 *
 * Example:
 * Input:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 * Output: 1 2 3 6 9 8 7 4 5
 */
void exercise_5_8() {
    int n, m;
    cout << "Enter dimensions (n m): ";
    cin >> n >> m;
    int mat[10][10];

    cout << "Enter matrix elements:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> mat[i][j];
        }
    }

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.9: Најдолга подреченица со уникатни карактери
 * Find longest substring with unique characters
 *
 * Example:
 * Input: "abcabcbb"
 * Output: 3 (substring: "abc")
 */
void exercise_5_9() {
    char str[100];
    cout << "Enter string: ";
    cin.ignore();
    cin.getline(str, 100);

    // TODO: Your code here
}

/*
 * ЗАДАЧА 5.10: Премин од низа во број и обратно
 * Convert array of digits to number and vice versa
 *
 * Example:
 * Input: [1, 2, 3, 4, 5]
 * Output: 12345
 */
void exercise_5_10() {
    int n;
    cout << "Enter number of digits: ";
    cin >> n;
    int digits[100];

    cout << "Enter digits: ";
    for (int i = 0; i < n; i++) {
        cin >> digits[i];
    }

    // TODO: Convert array to number
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

int main() {
    cout << "========================================\n";
    cout << "  СТРУКТУРНО ПРОГРАМИРАЊЕ - ВЕЖБИ\n";
    cout << "  Structural Programming Exercises\n";
    cout << "========================================\n\n";
    cout << "Uncomment ONE exercise at a time to exams.\n";
    cout << "Implement the solution in the function body.\n\n";

    // ========================================
    // 1. NUMBER MANIPULATION
    // ========================================
    // exercise_1_1(); // Add digit to end
    // exercise_1_2(); // Get last digit
    // exercise_1_3(); // Add digit to beginning
    // exercise_1_4(); // Remove last digit
    // exercise_1_5(); // Remove first digit
    // exercise_1_6(); // Check palindrome
    // exercise_1_7(); // Count digits
    // exercise_1_8();   // Sum of digits
    // exercise_1_9(); // Product of digits
    // exercise_1_10();  // Reverse number

    // ========================================
    // 2. ARRAYS
    // ========================================
    // exercise_2_1(); // Find min and max
    // exercise_2_2(); // Find second min and max
    // exercise_2_3();   // Delete element at index
    // exercise_2_4(); // Insert element at index
    // exercise_2_5(); // Rotate right
    // exercise_2_6(); // Rotate left
    // exercise_2_7(); // Bubble sort
    // exercise_2_8(); // Reverse array
    // exercise_2_9(); // Check if sorted
    // exercise_2_10(); // Linear search

    // ========================================
    // 3. MATRICES
    // ========================================
    // exercise_3_1();   // Set main diagonal
    // exercise_3_2();   // Sum main diagonal
    // exercise_3_3();   // Sum secondary diagonal
    // exercise_3_4();   // Sum above main diagonal
    // exercise_3_5();   // Sum below main diagonal
    // exercise_3_6();   // Check symmetric (main)
    // exercise_3_7();   // Check symmetric (secondary)
    // exercise_3_8();   // Transpose matrix
    // exercise_3_9();   // Add two matrices
    // exercise_3_10();  // Multiply by scalar

    // ========================================
    // 4. STRINGS AND CHARACTERS
    // ========================================
    // exercise_4_1();   // Get ASCII value
    // exercise_4_2();   // ASCII to character
    // exercise_4_3();   // String length (manual)
    // exercise_4_4();   // Compare strings (manual)
    // exercise_4_5();   // Copy string (manual)
    // exercise_4_6();   // To uppercase
    // exercise_4_7();   // To lowercase
    // exercise_4_8();   // Count words
    // exercise_4_9();   // Count vowels
    // exercise_4_10();  // Count consonants
    // exercise_4_11();  // Check palindrome
    // exercise_4_12();  // Reverse string
    // exercise_4_13();  // Caesar cipher
    // exercise_4_14();  // Remove spaces
    // exercise_4_15();  // Check anagram

    // ========================================
    // 5. COMPLEX EXERCISES
    // ========================================
    // exercise_5_1();   // Digit frequency
    // exercise_5_2();   // Longest increasing subarray
    // exercise_5_3();   // Rotate matrix 90°
    // exercise_5_4();   // Longest common prefix
    // exercise_5_5();   // Character frequency
    // exercise_5_6();   // Perfect number
    // exercise_5_7();   // Armstrong number
    // exercise_5_8();   // Spiral matrix
    // exercise_5_9();   // Longest unique substring
    // exercise_5_10();  // Array to number conversion

    return 0;
}
