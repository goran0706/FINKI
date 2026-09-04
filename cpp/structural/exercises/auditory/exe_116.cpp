// Од тастатура се читаат 2 позитивни цели броеви.
// Доколку се внесе барем еден негативен број или 0 треба да се печати „Invalid input“.
// Треба да се определи дали помалиот број “е парен еквивалент” од поголемиот број.
// Еден број “е парен еквивалент” на друг број, ако и само ако неговите цифри се наоѓаат на парните позиции од другиот број, во истиот редослед.
// Соодветно да се испечатат пораки „PAREN“ и „NE“.
// Позициите треба да се сметаат оддесно-налево (најмалку значајната цифра е на позиција 1)
//
// For example:
// Input 	        Result
// 12345678 1357    PAREN

#include <iostream>
using namespace std;

// Extract digit at position pos (1-indexed from right)
int get_digit(int num, int pos) {
    for (int i = 1; i < pos; i++) {
        num /= 10;
    }
    return num % 10;
}

// Count digits in a number
int count_digits(int num) {
    int count = 0;
    while (num > 0) {
        count++;
        num /= 10;
    }
    return count;
}

bool pair_eq(int smaller, int larger) {
    int s_digits = count_digits(smaller);
    int l_digits = count_digits(larger);

    int s_pos = 1;  // Position in smaller (right-to-left)
    int l_pos = 2;  // Start at position 2 (first even position in larger)

    while (s_pos <= s_digits) {
        // Check if we've exceeded larger's digits
        if (l_pos > l_digits) {
            return false;
        }

        // Get digits at current positions
        int s_digit = get_digit(smaller, s_pos);
        int l_digit = get_digit(larger, l_pos);

        // Check if they match
        if (s_digit != l_digit) {
            return false;
        }

        // Move to next positions
        s_pos++;
        l_pos += 2;  // Jump to next even position (skip odd)
    }

    return true;
}

int main() {
    int a, b;
    cin >> a >> b;

    // Validate input
    if (a <= 0 || b <= 0) {
        cout << "Invalid input" << endl;
        return 0;
    }

    // Determine which is smaller and which is larger
    int smaller = (a < b) ? a : b;
    int larger = (a < b) ? b : a;

    // Check if smaller is even-equivalent of larger
    if (pair_eq(smaller, larger)) {
        cout << "PAREN" << endl;
    } else {
        cout << "NE" << endl;
    }

    return 0;
}