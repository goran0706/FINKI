/*
    === 3. ===
    Vnesuvas string i treba da vidis koja bukva vo stringot ima najgolema razlika po apsolutna vrednost
    od levata strana na stringot i od desnata (primer vo "bbaaabb" , 'b' ima dve pojavuvanja na levata polovina na stringot i
    dve pojavuvanja desno razlikata po apsolutna vrednost e 2-2=0, 'a' ima dve pojavuvanja levo i edno desno 2-1=1, najgolema razlika ja ima a)
*/
#include <iostream>
#include <cstring>
#include <cmath>
using namespace std;

int main() {
    char str[101];
    cin.getline(str, 101);

    // Solution 1:
    // int length = strlen(str);
    // int max_diff = -1;
    // char max_char = str[0];
    //
    // int mid = length / 2;
    //
    // for (int i = 0; i < length; i++) {
    //     int alpha_first_half_count = 0;
    //     int alpha_second_half_count = 0;
    //
    //     for (int j = 0; j < mid; j++) {
    //         if (str[i] == str[j]) {
    //             alpha_first_half_count++;
    //         }
    //     }
    //
    //     for (int j = mid; j < length; j++) {
    //         if (str[i] == str[j]) {
    //             alpha_second_half_count++;
    //         }
    //     }
    //
    //     int diff = abs(alpha_first_half_count - alpha_second_half_count);
    //
    //     if (diff > max_diff) {
    //         max_diff = diff;
    //         max_char = str[i];
    //     }
    // }
    //
    // cout << max_char << ":" << max_diff << endl;

    // Solution 2:
    int length = strlen(str);
    int middle = length / 2;

    int left_counts[256] = {};
    int right_counts[256] = {};

    for (int i = 0; i < middle; i++) {
        left_counts[static_cast<unsigned char>(str[i])]++;
    }

    for (int i = middle; i < length; i++) {
        right_counts[static_cast<unsigned char>(str[i])]++;
    }

    int max_diff = -1;
    char max_char = ' ';

    for (int i = 0; i < length; i++) {
        const char current_char = str[i];
        int diff = abs(left_counts[(unsigned char) current_char] - right_counts[(unsigned char) current_char]);

        if (diff > max_diff) {
            max_diff = diff;
            max_char = current_char;
        }
    }

    if (max_diff != -1) {
        cout << max_char << ":" << max_diff << endl;
    }

    return 0;
}
