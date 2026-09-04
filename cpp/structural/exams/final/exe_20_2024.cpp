/*
    ============================================================
    TASK 5
    ============================================================
    Се чита ливче во спортска обложувалница.
    Да се испечати типот со најголем коефициент и можната добивка.
*/
#include <iostream>
using namespace std;

int main() {
    int numberMatches;
    cin >> numberMatches;

    double coefficient;
    double maxCoefficient = 0.0;
    double totalCoefficient = 1.0;

    for (int i = 0; i < numberMatches; i++) {
        cin >> coefficient;
        totalCoefficient *= coefficient;

        if (coefficient > maxCoefficient) {
            maxCoefficient = coefficient;
        }
    }

    double payment;
    cin >> payment;

    cout << "Highest coefficient: " << maxCoefficient << endl;
    cout << "Possible reward: " << payment * totalCoefficient << endl;

    return 0;
}
