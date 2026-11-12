// Да се напише програма за пресметување на возраста на едно куче во човечки години.
// Кучешката возраст се чита од стандарден влез.
//
// Доколку се внесе негативен број за возраста, да се испечати следната порака:
// “Vozrasta mora da bide pozitiven broj”.
//
// Забелешка: За првите две години, една кучешка година е еднаква на 10,5 човечки години.
// После тоа, секоја кучешка година е еднаква на 4 човечки години.

#include <iostream>
using namespace std;

int main() {
    double years;
    cin >> years;

    if (years < 0) {
        cout << "Vozrasta mora da bide pozitiven broj." << endl;
        return 1;
    }

    if (years <= 2) {
        years = years * 10.5;
    } else {
        years = (years - 2) * 4 + (2 * 10.5);
    }

    cout << "Human years: " << years << endl;

    return 0;
}
