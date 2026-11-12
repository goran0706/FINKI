#include "iostream"
#include "iomanip"
using namespace std;

struct Vozenje {
    char ime[100];
    int minuti;
    float cena;
    bool popust;

    void print() {
        cout << ime << " " << minuti << " " << setprecision(2) << fixed << cena << endl;
    }
};

struct ZabavenPark {
    char name[100];
    char lokacija[100];
    Vozenje vozenja[100];
    int brVozenja;

    void print() {
        cout << name << " " << lokacija << endl;
        for (int i = 0; i < brVozenja; ++i) {
            vozenja[i].print();
        }
    }
};


void najdobar_park(ZabavenPark *zp, int n) {
    int maxVM = 0;
    int maxB = 0;
    int index = 0;
    for (int i = 0; i < n; ++i) {
        int vm = 0;
        int br = 0;
        for (int j = 0; j < zp[i].brVozenja; ++j) {
            vm = vm + zp[i].vozenja[j].minuti;
        }
        for (int k = 0; k < zp[i].brVozenja; ++k) {
            if (zp[i].vozenja[k].popust) {
                br++;
            }
        }
        if (maxB < br) {
            maxVM = vm;
            maxB = br;
            index = i;
        } else if (maxB == br) {
            if (vm > maxVM) {
                maxVM = vm;
                index = i;
            }
        }
    }
    cout << "Najdobar park: " << zp[index].name << " " << zp[index].lokacija;
}

int main() {
    int n;
    cin >> n;
    ZabavenPark zp[100];
    for (int i = 0; i < n; ++i) {
        cin >> zp[i].name;
        cin >> zp[i].lokacija;
        cin >> zp[i].brVozenja;
        for (int j = 0; j < zp[i].brVozenja; ++j) {
            cin >> zp[i].vozenja[j].ime;
            cin >> zp[i].vozenja[j].minuti;
            cin >> zp[i].vozenja[j].cena;
            cin >> zp[i].vozenja[j].popust;
        }
    }
    for (int i = 0; i < n; ++i) {
        zp[i].print();
    }
    najdobar_park(zp, n);


    return 0;
}
