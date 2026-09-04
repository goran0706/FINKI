#include <iostream>
using namespace std;

struct SkiLift {
    char name[15];
    int maxNumber;
    bool works;
};

struct SkiCenter {
    char name[20];
    char CountryName[20];
    SkiLift array[20];
    int n;

    int numberOfCostumers() {
        int number = 0;
        for (int i = 0; i < n; i++) {
            if (array[i].works == 1) {
                number += array[i].maxNumber;
            }
        }
        return number;
    }
};

void najgolemKapacitet(SkiCenter *sc, int n) {
    int max = 0, index = 0;
    for (int i = 0; i < n; i++) {
        if (sc[i].numberOfCostumers() > max) {
            max = sc[i].numberOfCostumers();
            index = i;
        }
        if (sc[i].numberOfCostumers() == max) {
            if (sc[i].n > sc[index].n) {
                index = i;
            }
        }
    }
    cout << sc[index].name << endl;
    cout << sc[index].CountryName << endl;
    cout << sc[index].numberOfCostumers() << endl;
}

int main() {
    int n;
    cin >> n;

    SkiCenter ski[n];

    for (int i = 0; i < n; i++) {
        cin >> ski[i].name;
        cin >> ski[i].CountryName;
        cin >> ski[i].n;
        for (int j = 0; j < ski[i].n; j++) {
            cin >> ski[i].array[j].name;
            cin >> ski[i].array[j].maxNumber;
            cin >> ski[i].array[j].works;
        }
    }

    najgolemKapacitet(ski, n);

    return 0;
}
