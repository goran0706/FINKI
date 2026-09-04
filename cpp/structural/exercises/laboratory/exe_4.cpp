// TASK 4:
// Да се напише програма која пресметува просечна оцена во семестар. Програмата чита 5 цели броја.
// Треба да се испечати еден реален број на две децимали, просек на прочитаните броеви.

#include <iomanip>
#include <iostream>
using namespace std;

int main() {
    int n;
    int sum = 0;

    for (int i = 0; i < 5; i++) {
        cin >> n;
        sum += n;
    }

    double average = double(sum) / 5;
    cout << setw(2) << average << endl;
}
