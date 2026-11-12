// Да се напише програма што од непознат број на цели броеви кои се внесуваат од тастатура
// ќе ги определи позициите (редните броеви на внесување) на двата последователни броја што ја имаат најголемата сума.

// Програмата завршува ако едно по друго (последователно) се внесат два негативни цели броја.
// 2 4 3 4 2 1 1 6 1 7 -1 -1

#include <iostream>
#include <climits>
using namespace std;

int main() {
    int max_sum = INT_MIN;
    int count = 0;
    int prev = 0;
    int prev_pos = -1;
    int curr_pos = -1;
    bool first = true;

    int curr;
    while (cin >> curr) {
        if (!first && prev < 0 && curr < 0) {
            break;
        }

        if (!first) {
            if (curr + prev > max_sum) {
                max_sum = curr + prev;
                prev_pos = count - 1;
                curr_pos = count;
            }
        }

        prev = curr;
        count++;
        first = false;
    }

    if (prev_pos != -1) {
        cout << "Максимална сума: " << max_sum << endl;
        cout << "Позиции: " << prev_pos << " и " << curr_pos << endl;
    } else {
        cout << "Нема доволно броеви" << endl;
    }

    return 0;
}
