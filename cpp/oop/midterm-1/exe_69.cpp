#include <iostream>
#include <cstring>
using namespace std;

struct Voz {
    char relation[50];
    int km;
    int numberOfPassengers;
};

struct ZeleznickaStanica {
    char city[20];
    Voz voz[30];
    int numberOfTrains;
};

void najkratkaRelacija(ZeleznickaStanica *zs, int n, char *grad) {
    int dist = 300000;
    int indexj = 0, indexi = 0;
    for (int i = 0; i < n; i++) {
        if (strcmp(zs[i].city, grad) == 0) {
            indexi = i;
            for (int j = 0; j < zs[i].numberOfTrains; j++) {
                if (zs[i].voz[j].km <= dist) {
                    dist = zs[i].voz[j].km;
                    indexj = j;
                }
            }
        }
    }
    cout << "Najkratka relacija: " << zs[indexi].voz[indexj].relation << " (" << zs[indexi].voz[indexj].km << " km)" <<
            endl;
}

int main() {
    int n;
    cin >> n; //se cita brojot na zelezlnichki stanici
    ZeleznickaStanica zStanica[100];
    for (int i = 0; i < n; i++) {
        cin >> zStanica[i].city;
        cin >> zStanica[i].numberOfTrains;
        for (int j = 0; j < zStanica[i].numberOfTrains; j++) {
            //se citaat infomracii za n zelezlnichkite stanici i se zacuvuvaat vo poleto zStanica
            cin >> zStanica[i].voz[j].relation;
            cin >> zStanica[i].voz[j].km;
            cin >> zStanica[i].voz[j].numberOfPassengers;
        }
    }

    char grad[25];
    cin >> grad;

    najkratkaRelacija(zStanica, n, grad);

    return 0;
}
