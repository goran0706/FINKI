// TASK 2:
// Да се напише програма која вчитува од стандарден влез два децимални броја (маса во кг и висина во цм)
// и пресметува и печати на стандарден излез индекс на телесна маса по формулата: BMI=masa/(visina*visina).
// Висината претходно треба да се претвори од сантиметри во метри.

#include <iostream>
using namespace std;

int main() {
    double mass, height;
    cin >> mass >> height;

    double BMI = mass / (height * height);
    cout << "BMI = " << BMI << endl;
}
