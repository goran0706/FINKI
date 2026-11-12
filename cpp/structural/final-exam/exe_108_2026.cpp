// Vnesuvas string i treba da vidis koja bukva vo stringot ima najgolema razlika po apsolutna vrednost
// od levata strana na stringot i od desnata (primer vo "bbaaabb" , 'b' ima dve pojavuvanja na levata polovina na stringot
// i dve pojavuvanja desno razlikata po apsolutna vrednost e 2-2=0, 'a' ima dve pojavuvanja levo i edno desno 2-1=1, najgolema razlika ja ima a)
#include <cstring>
#include <iostream>
#include <cmath> // за abs()
using namespace std;

int main() {
    char str[100];
    cin.getline(str, 100);

    int max_diff = -1;
    char max_char = ' ';

    int length = strlen(str);
    int mid = length / 2;
    int right_start = length % 2 != 0 ? length - mid : mid;

    for (int i = 0; i < length; i++) {
        int left_count = 0;
        int right_count = 0;

        for (int j = 0; j < mid; j++) {
            if (str[i] == str[j]) {
                left_count++;
            }
        }

        for (int j = right_start; j < length; j++) {
            if (str[i] == str[j]) {
                right_count++;
            }
        }

        int current_diff = abs(left_count - right_count);

        if (current_diff > max_diff) {
            max_diff = current_diff;
            max_char = str[i];
        }
    }

    cout << max_char << endl;

    return 0;
}
