/*
    1.5 Држави

    Да се напише програма која од стандарден влез ќе чита податоци за држави и на екран ќе го отпечати името и презимето
    на претседателот на државата чиj што главен град има најмногу жители.

    Податоци за држава:
    - име
    - претседател
    - главен град
    - број на жители.

    Податоци за град:
    - име
    - број на жители.

    Податоци за претседател:
    - име
    - презиме
    - политичка партија.
*/
#include <iostream>
using namespace std;

struct President {
    char firstName[50];
    char lastName[50];
    char politicalParty[50];
};

struct Capital {
    char name[50];
    int population;
};

struct Country {
    char name[50];
    President president;
    Capital capital;
    int population;

    void print() const {
        cout << name << "\t";
        cout << president.firstName << " " << president.lastName << " " << president.politicalParty << "\t";
        cout << capital.name << " " << capital.population << "\t";
        cout << population << endl;
    }
};

Country largest_capital(Country a[], int n) {
    Country max = a[0];

    for (int i = 0; i < n; i++) {
        if (a[i].capital.population > max.capital.population) {
            max = a[i];
        }
    }

    return max;
}

void read(Country &c) {
    cin >> c.name;
    cin >> c.president.firstName;
    cin >> c.president.lastName;
    cin >> c.president.politicalParty;
    cin >> c.capital.name;
    cin >> c.capital.population;
    cin >> c.population;
}

int main() {
    int n;
    cin >> n;

    Country countries[100];

    for (int i = 0; i < n; i++) {
    }

    largest_capital(countries, n).print();
}
